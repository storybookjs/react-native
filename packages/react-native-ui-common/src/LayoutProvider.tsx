import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext, useMemo } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { BREAKPOINT } from './constants';

type LayoutContextType = {
  isDesktop: boolean;
  isMobile: boolean;
};

const LayoutContext = createContext<LayoutContextType>({
  isDesktop: false,
  isMobile: true,
});

export const LayoutProvider: FC<PropsWithChildren> = ({ children }) => {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'macos' || Platform.OS === 'windows' || width >= BREAKPOINT;
  const isMobile = !isDesktop;

  const contextValue = useMemo(
    () => ({
      isDesktop,
      isMobile,
    }),
    [isDesktop, isMobile]
  );

  return <LayoutContext.Provider value={contextValue}>{children}</LayoutContext.Provider>;
};

export const useLayout = () => useContext(LayoutContext);
