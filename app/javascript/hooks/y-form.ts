import { ChangeEvent, InputHTMLAttributes, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { WebsocketProvider } from '@y-rb/actioncable'
import { createConsumer } from '@rails/actioncable'
import * as Y from 'yjs'
import { diffChars } from 'diff'
import { FieldArray, FieldRecord, formCtx } from './useFormContext'
import { useForceRender } from './useForceRender'
import { useYObserver } from './useYObserver'
import { useUserFocus } from './awareness'

const actionCableConsumer = createConsumer();

export const useIsSynced = (provider?: WebsocketProvider) => {
  const [isSynced, setIsSynced] = useState(false);
  useEffect(() => {
    if (!provider) return;
    const timer = setInterval(() => {
      if (provider.synced) {
        clearInterval(timer);
        setIsSynced(true);
      }
    }, 800);
    return () => clearInterval(timer);
  }, [provider]);
  return isSynced;
}

export const useYForm = () => {
  const [yDoc, setYDoc] = useState<Y.Doc | undefined>(undefined);
  const [provider, setProvider] = useState<WebsocketProvider | undefined>(undefined);
  const isSynced = useIsSynced(provider);

  useEffect(() => {
    const doc = new Y.Doc();
    (window as any).yDoc = doc; // For debugging

    const pro = new WebsocketProvider(doc, actionCableConsumer, 'FormChannel', { id: 'thisdocid' });

    setYDoc(doc);
    setProvider(pro);
  }, [])

  const root = yDoc?.getMap('form');

  return {
    yDoc: yDoc,
    provider: provider,
    root: { record: root, id: 'root', fieldPath: '' },
    isReady: isSynced,
  }
}

export const setupFieldValue = <T extends Y.AbstractType<any>>(
  root: FieldRecord,
  name: string,
  defaultValue: T
): T | undefined => {
  if (!root.record) return
  const value = root.record.get(name);
  // TODO: Instead of setting Y.Text to document
  // If no value/value not text, return default value
  // If value and value !== doc.value, apply delta from value to doc.value and return doc.value
  // If value and value === doc.value, return doc.value
  // (Don't know how to maintain Y.Text local instead of getting it from doc)
  if (!value || !(value instanceof defaultValue.constructor))
    return root.record.set(name, defaultValue);
  return root.record.get(name);
}

export const useYTextField = (root: FieldRecord, name: string) => {
  const fieldPath = `${root.fieldPath}/${name}`;
  const { yDoc } = useContext(formCtx);
  const $inputRef = useRef<HTMLInputElement | undefined>();

  const { onFocus, onBlur } = useUserFocus(fieldPath);

  const value = useMemo(() => setupFieldValue(root, name, new Y.Text()), [name, root.record]);

  useYObserver(value, (_ev, tr) => {
    if (!$inputRef.current || !value || tr.origin === 'local-update') return;
    const isFocussed = document.activeElement === $inputRef.current;

    // Adjust selection/cursor position
    const [_, start, end] = !isFocussed
      ? [0, 0, 0]
      : _ev.changes.delta.reduce(([idx, curS, curE], change) => {
        if (change.retain) {
          idx += change.retain;
        } else if (change.insert) {
          idx += change.insert.length;
          if (idx < curS) {
            curS += change.insert.length;
            curE += change.insert.length;
          } else if (idx >= curS && idx < curE) {
            curE += change.insert.length;
          }
        } else if (change.delete) {
          idx -= change.delete;
          if (idx < curS) {
            curS -= change.delete;
            curE -= change.delete;
          } else if (idx >= curS && idx < curE) {
            curE -= change.delete;
          }
        }

        return [idx, curS, curE]
      }, [0, $inputRef.current.selectionStart ?? 0, $inputRef.current.selectionEnd ?? 0])

    // Update value
    $inputRef.current.value = value.toString();

    // Set selection
    if (isFocussed) {
      $inputRef.current.setSelectionRange(start, end)
    }
  })

  useEffect(() => {
    if (!$inputRef.current || !value) return;
    // Initial value
    $inputRef.current.value = value.toString();
  }, [value])

  const onChange = useCallback((_) => {
    if (!$inputRef.current || !value) return;

    yDoc?.transact((_tr) => {
      // TODO: optimizaiton: Detect first index of change and diff from there?
      // Or use fast-diff?
      diffChars(value.toString(), $inputRef.current!.value).reduce((index, part) => {
        if (part.added) {
          value.insert(index, part.value);
        } else if (part.removed && part.count) {
          value.delete(index, part.count);
        }
        return index + (part.count ?? 0)
      }, 0)
    }, 'local-update');
  }, [value, yDoc]);

  return {
    fieldPath,
    props: {
      ref: (el) => ($inputRef.current = el),
      name,
      // value: inputValue,
      onFocus,
      onBlur,
      onChange,
    } satisfies InputHTMLAttributes<HTMLInputElement> & { ref: (el: HTMLInputElement) => void },
  };
}

export const useYArrayField = <T>(root: FieldRecord, name: string): FieldArray<T> => {
  const [updateCount, forceRender] = useForceRender()

  const array = useMemo(() => setupFieldValue(root, name, new Y.Array<Y.Map<any>>()), [name, root.record, updateCount]);

  useYObserver(array, (ev) => {
    console.log('>>> arr', ev)
    forceRender();
  })

  return useMemo((): FieldArray<T> => ({
    fieldPath: `${root.fieldPath}/${name}`,
    array: array?.map(item => ({
      record: item,
      get fieldPath() {
        return `${root.fieldPath}/${name}/${item.get('_id').toString()}`;
      },
      get id() {
        return item.get('_id').toString()
      },
    })) ?? [],
    updateCount,
    append(item) {
      const randomId = `${Math.random()}`
      array?.insert(array.length, [new Y.Map(Object.entries({ _id: randomId, ...item }))]);
    },
    delete(index) {
      array?.delete(index, 1);
    },
    get length() {
      return array?.length ?? 0;
    },
  }), [array, updateCount]);
};

export const useYValueField = <T = string>(root: FieldRecord, name: string, defaultValue?: T) => {
  const fieldPath = `${root.fieldPath}/${name}`;
  const [value, setValue] = useState<T | undefined>(defaultValue);
  const { onFocus, onBlur } = useUserFocus(fieldPath);

  useEffect(() => {
    if (!root.record) return;
    setValue(root.record?.get(name))
  }, [root.record]);

  useYObserver(root.record, (ev) => {
    if (ev.keysChanged.has(name)) {
      setValue(root.record?.get(name));
    }
  });

  const updateValue = (newValue: T | undefined) => {
    root.record?.set(name, newValue);
  }

  return {
    value,
    updateValue,
    fieldPath,
    props: {
      name,
      value,
      'data-field-id': fieldPath,
      onFocus,
      onBlur,
      onChange: (e: ChangeEvent<any>) => updateValue(e.currentTarget?.value as T),
    }
  }
}
