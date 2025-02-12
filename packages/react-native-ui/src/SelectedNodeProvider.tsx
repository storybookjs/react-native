import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useRef } from 'react';
import type { View } from 'react-native';

type SelectedNodeContextType = {
  nodeRef: React.RefObject<View>;
  setNodeRef: (node: View | null) => void;
};

const SelectedNodeContext = createContext<SelectedNodeContextType>({
  nodeRef: { current: null },
  setNodeRef: () => {},
});

export const SelectedNodeProvider: FC<PropsWithChildren> = ({ children }) => {
  const nodeRef = useRef<View | null>(null);

  const setNodeRef = useCallback((node: View | null) => {
    nodeRef.current = node;
  }, []);

  return (
    <SelectedNodeContext.Provider
      value={{
        nodeRef,
        setNodeRef,
      }}
    >
      {children}
    </SelectedNodeContext.Provider>
  );
};

export const useSelectedNode = () => useContext(SelectedNodeContext);
