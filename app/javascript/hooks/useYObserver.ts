import { useEffect, useRef } from "react";
import * as Y from 'yjs'

export const useYObserver = <T extends Y.AbstractType<any>>(
  value: T | undefined,
  handler: Parameters<T['observe']>[0]
) => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!value) return;
    // @ts-ignore
    const onEvent = (...p: any[]) => handlerRef.current(...p)
    value.observe(onEvent)
    return () => value.unobserve(onEvent)
  }, [value])
}
