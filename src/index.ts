import { useState, useLayoutEffect, useRef, useCallback } from "react";

export type NextTickCallback = () => void | Promise<void>;

export default function useNextTick(): (cb: NextTickCallback) => void {
  const [tick, setTick] = useState(0);
  const callbacksRef = useRef<NextTickCallback[]>([]);

  useLayoutEffect(() => {
    // Skip the initial mount — nothing is queued yet.
    if (tick === 0) return;

    const pending = callbacksRef.current;
    callbacksRef.current = [];
    for (const cb of pending) {
      cb();
    }
  }, [tick]);

  const nextTick = useCallback((cb: NextTickCallback) => {
    callbacksRef.current.push(cb);
    setTick((c) => c + 1);
  }, []);

  return nextTick;
}
