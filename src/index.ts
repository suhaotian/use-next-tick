import { useEffect, useRef, useCallback } from "react";

export type NextTickCallback = () => void | Promise<void>;

export default function useNextTick(): (cb: NextTickCallback) => void {
  const callbacksRef = useRef<NextTickCallback[]>([]);
  const pendingRef = useRef(false);

  useEffect(() => {
    if (!pendingRef.current) return;

    pendingRef.current = false;
    const pending = callbacksRef.current;
    callbacksRef.current = [];

    // DOM is now updated, run callbacks
    for (const cb of pending) {
      cb();
    }
  });

  const nextTick = useCallback((cb: NextTickCallback) => {
    callbacksRef.current.push(cb);
    pendingRef.current = true;
  }, []);

  return nextTick;
}
