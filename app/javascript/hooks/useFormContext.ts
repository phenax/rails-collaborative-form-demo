import { createContext, useContext } from 'react'
import { WebsocketProvider } from '@y-rb/actioncable'
import * as Y from 'yjs'

export type FieldRecord = Readonly<{
  record: Y.Map<any> | undefined;
  id: string;
  fieldPath: string;
}>;

export type FieldArray<T = any> = Readonly<{
  fieldPath: string;
  array: FieldRecord[];
  append: (item: T) => void;
  delete: (index: number) => void;
  length: number;
}>;

export type FormCtx = {
  yDoc?: Y.Doc,
  root: FieldRecord,
  provider?: WebsocketProvider,
  isReady?: boolean,
}

export const formCtx = createContext<FormCtx>(undefined!);

export const useFormContext = () => useContext(formCtx);

