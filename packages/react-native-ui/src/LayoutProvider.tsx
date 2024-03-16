import type { FC, PropsWithChildren } from 'react';
import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { BREAKPOINT } from './constants';
import { useWindowDimensions } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

type LayoutContextType = {
  // isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  // isMobileAboutOpen: boolean;
  // setMobileAboutOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // isMobilePanelOpen: boolean;
  // setMobilePanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDesktop: boolean;
  isMobile: boolean;
};

const LayoutContext = createContext<LayoutContextType>({
  // isMobileMenuOpen: false,

  openMobileMenu: () => {},
  closeMobileMenu: () => {},
  // isMobileAboutOpen: false,
  // setMobileAboutOpen: () => {},
  // isMobilePanelOpen: false,
  // setMobilePanelOpen: () => {},

  isDesktop: false,
  isMobile: false,
});

export const LayoutProvider: FC<PropsWithChildren> = ({ children }) => {
  // const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const [isMobileAboutOpen, setMobileAboutOpen] = useState(false);
  // const [isMobilePanelOpen, setMobilePanelOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINT;
  const isMobile = !isDesktop;
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const openMobileMenu = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const closeMobileMenu = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const contextValue = useMemo(
    () => ({
      // isMobileMenuOpen,
      openMobileMenu,
      closeMobileMenu,
      // isMobileAboutOpen,
      // setMobileAboutOpen,
      // isMobilePanelOpen,
      // setMobilePanelOpen,
      isDesktop,
      isMobile,
    }),
    [
      // isMobileMenuOpen,
      openMobileMenu,
      closeMobileMenu,
      // // isMobileAboutOpen,
      // setMobileAboutOpen,
      // isMobilePanelOpen,
      // setMobilePanelOpen,
      isDesktop,
      isMobile,
    ]
  );

  return (
    <BottomSheetModalProvider>
      <LayoutContext.Provider value={contextValue}>{children}</LayoutContext.Provider>
      <BottomSheetModal ref={bottomSheetModalRef} snapPoints={['70%', '50%']}>
        <BottomSheetScrollView>bla</BottomSheetScrollView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export const useLayout = () => useContext(LayoutContext);
