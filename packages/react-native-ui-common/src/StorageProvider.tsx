import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';

export interface Storage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
}

const StorageContext = createContext<Storage>({
  getItem: async () => null,
  setItem: async () => {},
});

export const StorageProvider: FC<PropsWithChildren<{ storage: Storage }>> = ({
  storage,
  children,
}) => {
  return <StorageContext.Provider value={storage}>{children}</StorageContext.Provider>;
};

export const useStorage = () => useContext(StorageContext);
