import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext, useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
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
  const isDesktop = width >= BREAKPOINT;
  const isMobile = !isDesktop;

  // console.log({ isDesktop, isMobile, breakpoint: BREAKPOINT, width });

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
