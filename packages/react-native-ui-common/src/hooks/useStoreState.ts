import { useCallback, useEffect, useState } from 'react';
import { useStorage } from '../StorageProvider';

export const useStoreBooleanState = (
  key: string,
  defaultValue: boolean
): ReturnType<typeof useState<boolean>> => {
  const storage = useStorage();

  const [val, setVal] = useState<boolean>(defaultValue);

  useEffect(() => {
    storage.getItem(key).then((newVal) => {
      if (newVal === null || newVal === undefined) {
        setVal(defaultValue);
      } else {
        setVal(newVal === 'true');
      }
    });
  }, [key, storage, defaultValue]);

  useEffect(() => {
    storage.setItem(key, val.toString());
  }, [key, storage, val]);

  return [val, setVal];
};

export const useStoreNumberState = (
  key: string,
  defaultValue: number
): [number, (value: number | ((prev: number) => number)) => void] => {
  const storage = useStorage();

  const [val, setVal] = useState<number>(defaultValue);

  useEffect(() => {
    storage.getItem(key).then((newVal) => {
      if (newVal === null || newVal === undefined) {
        setVal(defaultValue);
      } else {
        const parsed = parseFloat(newVal);
        setVal(isNaN(parsed) ? defaultValue : parsed);
      }
    });
  }, [key, storage, defaultValue]);

  const setAndStore = useCallback(
    (value: number | ((prev: number) => number)) => {
      setVal((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        storage.setItem(key, next.toString());
        return next;
      });
    },
    [key, storage]
  );

  return [val, setAndStore];
};
