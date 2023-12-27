import { createContext, useContext } from 'react'
import { WebsocketProvider } from '@y-rb/actioncable'
import * as Y from 'yjs'

export type FieldRecord = {
  record: Y.Map<any> | undefined;
  id: string;
  fieldPath: string;
};

export type FieldArray<T = any> = {
  fieldPath: string;
  array: FieldRecord[];
  updateCount: number;
  append: (item: T) => void;
  delete: (index: number) => void;
};

export type FormCtx = {
  yDoc?: Y.Doc,
  root: FieldRecord,
  provider?: WebsocketProvider,
}

export const formCtx = createContext<FormCtx>(undefined!);

export const useFormContext = () => useContext(formCtx);

