import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useRef } from 'react';

type ScrollToSelectedCallback = () => void;

type SelectedNodeContextType = {
  scrollToSelectedNode: () => void;
  registerScrollCallback: (callback: ScrollToSelectedCallback | null) => void;
};

const SelectedNodeContext = createContext<SelectedNodeContextType>({
  scrollToSelectedNode: () => {},
  registerScrollCallback: () => {},
});

export const SelectedNodeProvider: FC<PropsWithChildren> = ({ children }) => {
  const scrollCallbackRef = useRef<ScrollToSelectedCallback | null>(null);

  const registerScrollCallback = useCallback((callback: ScrollToSelectedCallback | null) => {
    scrollCallbackRef.current = callback;
  }, []);

  const scrollToSelectedNode = useCallback(() => {
    // Small delay to ensure list is rendered after drawer opens
    setTimeout(() => {
      scrollCallbackRef.current?.();
    }, 100);
  }, []);

  return (
    <SelectedNodeContext.Provider
      value={{
        scrollToSelectedNode,
        registerScrollCallback,
      }}
    >
      {children}
    </SelectedNodeContext.Provider>
  );
};

export const useSelectedNode = () => useContext(SelectedNodeContext);
