import { useEffect, useRef } from "react";
import * as Y from 'yjs'
import { FieldRecord, useFormContext } from "./useFormContext";

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

export const _: unique symbol = Symbol('y-wildcard')

export const useYObserverPath = <T extends Y.AbstractType<any>>(
  value: T | undefined,
  path: (string | number | '*')[],
  handler: (events: Y.YEvent<Y.AbstractType<any>>[]) => void
) => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!value) return;

    const onEvent = (events: Y.YEvent<Y.AbstractType<any>>[]) => {
      const matchEvents = events.filter(event => {
        if (event.path.length > path.length) return false;
        return event.path.every((k, i) => path[i] === '*' || k === path[i])
      })

      if (matchEvents.length > 0) {
        handlerRef.current(matchEvents);
      }
    }

    value.observeDeep(onEvent)
    return () => value?.unobserveDeep(onEvent)
  }, [])
}

