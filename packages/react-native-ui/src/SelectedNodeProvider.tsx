import { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useRef } from 'react';
import type { View } from 'react-native';

type SelectedNodeContextType = {
  nodeRef: React.RefObject<View>;
  setNodeRef: (node: View | null) => void;
  scrollToSelectedNode: () => void;
  scrollRef: React.RefObject<BottomSheetScrollViewMethods>;
};

const SelectedNodeContext = createContext<SelectedNodeContextType>({
  nodeRef: { current: null },
  setNodeRef: () => {},
  scrollToSelectedNode: () => {},
  scrollRef: null,
});

export const SelectedNodeProvider: FC<PropsWithChildren> = ({ children }) => {
  const nodeRef = useRef<View | null>(null);

  const setNodeRef = useCallback((node: View | null) => {
    nodeRef.current = node;
  }, []);

  const scrollRef = useRef<BottomSheetScrollViewMethods>(null);

  const scrollToSelectedNode = useCallback(() => {
    // maybe later we can improve on this to not use setTimeout but right now it seems like the simplest solution
    setTimeout(() => {
      if (nodeRef?.current && scrollRef?.current) {
        // im just not sure if older versions would error here,
        // since measure layout probably changed since new arch
        try {
          nodeRef.current.measureLayout?.(scrollRef.current as any, (_x, y) => {
            scrollRef.current?.scrollTo({ y: y - 100, animated: true });
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {}
      }
    }, 100);
  }, []);

  return (
    <SelectedNodeContext.Provider
      value={{
        nodeRef,
        setNodeRef,
        scrollToSelectedNode,
        scrollRef,
      }}
    >
      {children}
    </SelectedNodeContext.Provider>
  );
};

export const useSelectedNode = () => useContext(SelectedNodeContext);
