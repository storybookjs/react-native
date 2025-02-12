import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import type { View } from 'react-native';

type SelectedNodeContextType = {
  nodeRef: React.RefObject<View> | null;
  setNodeRef: (ref: React.RefObject<View> | null) => void;
};

const SelectedNodeContext = createContext<SelectedNodeContextType>({
  nodeRef: null,
  setNodeRef: () => {},
});

export const SelectedNodeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [nodeRef, setNodeRef] = useState<React.RefObject<View> | null>(null);

  const contextValue = useMemo(
    () => ({
      nodeRef,
      setNodeRef,
    }),
    [nodeRef, setNodeRef]
  );

  return (
    <SelectedNodeContext.Provider value={contextValue}>{children}</SelectedNodeContext.Provider>
  );
};

export const useSelectedNode = () => useContext(SelectedNodeContext);
