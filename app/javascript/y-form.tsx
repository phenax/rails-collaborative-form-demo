import React, { ChangeEvent, createContext, useContext, useEffect, useMemo, useState } from 'react'
import { WebsocketProvider } from '@y-rb/actioncable'
import { createConsumer } from '@rails/actioncable'
import * as Y from 'yjs'

export type FormCtx = {
  yDoc?: Y.Doc,
  provider?: WebsocketProvider,
}

const formCtx = createContext<FormCtx>(undefined!);

export const FormProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [yDoc, setYDoc] = useState<Y.Doc | undefined>(undefined);
  const [provider, setProvider] = useState<WebsocketProvider | undefined>(undefined);

  useEffect(() => {
    const doc = new Y.Doc();

    const consumer = createConsumer();
    const pro = new WebsocketProvider(doc, consumer, 'FormChannel', { id: 'mmmeee' });

    setYDoc(doc);
    setProvider(pro);
  }, [])

  return (
    <formCtx.Provider value={{ yDoc: yDoc, provider: provider }}>
      {children}
    </formCtx.Provider>
  )
}

export const useYTextField = (name: string) => {
  const [inputValue, setInputValue] = useState<string>('');
  const { yDoc } = useContext(formCtx);

  const value = useMemo(() => yDoc?.getText(name), [yDoc, name]);
  useEffect(() => {
    if (!value) return;

    setInputValue(value.toJSON().toString())

    const onEvent = (ev: Y.YTextEvent) => {
      setInputValue(ev.target.toJSON().toString())
    }
    value.observe(onEvent)
    return () => value.unobserve(onEvent)
  }, [value])

  return {
    props: {
      value: inputValue,
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        if (!value) return;

        yDoc?.transact((_tr) => {
          value.delete(0, value.length);
          value.insert(0, e.target.value);
        })
      }
    },
  };
}

