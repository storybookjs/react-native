import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useState } from 'react';
type CallbackOptions = { id?: string; animated?: boolean };

type SelectedNodeContextType = {
  registerCallback: (callback: (options: CallbackOptions) => void) => void;
  scrollCallback: (options: CallbackOptions) => void;
};

const SelectedNodeContext = createContext<SelectedNodeContextType>({
  registerCallback: () => {},
  scrollCallback: () => {},
});

export const SelectedNodeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [scrollCallbackValue, setScrollCallback] = useState<
    ((options: CallbackOptions) => void) | null
  >(null);

  const registerCallback = useCallback((callback: (options: CallbackOptions) => void) => {
    setScrollCallback(() => callback);
  }, []);

  const scrollCallback = useCallback(
    (options: CallbackOptions) => {
      scrollCallbackValue?.(options);
    },
    [scrollCallbackValue]
  );

  return (
    <SelectedNodeContext.Provider
      value={{
        scrollCallback,
        registerCallback,
      }}
    >
      {children}
    </SelectedNodeContext.Provider>
  );
};

export const useSelectedNode = () => useContext(SelectedNodeContext);
