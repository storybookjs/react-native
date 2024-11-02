import { useEffect, useState } from 'react';
import store from 'store2';

export const useStoreState = <T>(key: string, defaultValue: T): ReturnType<typeof useState<T>> => {
  const [val, setVal] = useState<T>(store.get(key) ?? defaultValue);

  useEffect(() => {
    store.set(key, val);
  }, [key, val]);

  return [val, setVal];
};
