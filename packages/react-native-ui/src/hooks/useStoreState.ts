import { useEffect, useState } from 'react';
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
