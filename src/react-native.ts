import { useEffect, useLayoutEffect, useRef, useCallback } from "react";

export type NextTickCallback = () => void | Promise<void>;

export default function useNextTick(
  useEffectHook: typeof useEffect | typeof useLayoutEffect = useEffect
): (cb: NextTickCallback) => void {
  const callbacksRef = useRef<NextTickCallback[]>([]);
  const pendingRef = useRef(false);

  useEffectHook(() => {
    if (!pendingRef.current) return;

    pendingRef.current = false;
    const pending = callbacksRef.current;
    callbacksRef.current = [];
    setTimeout(() => {
      for (const cb of pending) {
        cb();
      }
    }, 0);
  });

  const nextTick = useCallback((cb: NextTickCallback) => {
    callbacksRef.current.push(cb);
    pendingRef.current = true;
  }, []);

  return nextTick;
}
