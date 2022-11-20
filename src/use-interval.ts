import { useEffect } from 'react';

export function useInterval(cb: Function, ms: number, deps: any[]) {
  useEffect(() => {
    const intervalId = setInterval(cb, ms);

    return () => {
      intervalId && clearInterval(intervalId);
    };
  }, deps);
}
