import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react'
import { WebsocketProvider } from '@y-rb/actioncable'
import { createConsumer } from '@rails/actioncable'
import * as Y from 'yjs'
import { diffChars } from 'diff'
import { FieldArray, FieldRecord, formCtx } from './useFormContext'
import { useForceRender } from './useForceRender'
import { useYObserver } from './useYObserver'

(window as any).Y = Y; // For debugging

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
    }, 400);
    return () => clearInterval(timer);
  }, [provider]);
  return isSynced;
}

export const useYForm = () => {
  const [yDoc, setYDoc] = useState<Y.Doc | undefined>(undefined);
  const [provider, setProvider] = useState<WebsocketProvider | undefined>(undefined);
  const isSynced = useIsSynced(provider);
  const isReady = isSynced;

  useEffect(() => {
    const doc = new Y.Doc();
    (window as any).yDoc = doc; // For debugging

    const pro = new WebsocketProvider(doc, actionCableConsumer, 'FormChannel', { id: 'thisdocid' });

    setYDoc(doc);
    setProvider(pro);
  }, [])

  const root = yDoc?.getMap('form');

  return { yDoc: yDoc, provider: provider, root: { record: root, id: 'root' }, isReady }
}

export const setupFieldValue = <T extends Y.AbstractType<any>>(
  root: FieldRecord,
  name: string,
  defaultValue: T
): T | undefined => {
  if (!root.record) return
  const value = root.record.get(name);
  if (!value || !(value instanceof defaultValue.constructor))
    return root.record.set(name, defaultValue);
  return root.record.get(name);
}

export const useYTextField = (root: FieldRecord, name: string) => {
  const [inputValue, setInputValue] = useState<string>('');
  const { yDoc } = useContext(formCtx);

  const value = useMemo(() => setupFieldValue(root, name, new Y.Text()), [name, root.record]);

  useEffect(() => {
    if (!value) return;
    setInputValue(value.toJSON().toString())
  }, [value])

  useYObserver(value, (ev) => {
    setInputValue(ev.target.toJSON().toString())
  })

  return {
    props: {
      value: inputValue,
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        if (!value) return;

        yDoc?.transact((_tr) => {
          diffChars(value.toString(), e.target.value).reduce((index, part) => {
            if (part.added) {
              value.insert(index, part.value);
            } else if (part.removed && part.count) {
              value.delete(index, part.count);
            }
            return index + (part.count ?? 0)
          }, 0)
        })
      }
    },
  };
}

export const useYFieldArray = <T>(root: FieldRecord, name: string): FieldArray<T> => {
  const [updateCount, forceRender] = useForceRender()

  const array = useMemo(() => setupFieldValue(root, name, new Y.Array<Y.Map<any>>()), [name, root.record]);

  useYObserver(array, (ev) => {
    console.log('>>> arr', ev)
    forceRender();
  })

  return useMemo((): FieldArray<T> => ({
    array: array?.map(item => ({
      record: item,
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
  }), [array, updateCount]);
};

