import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { ReactNode, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

interface MobileMenuDrawerProps {
  children: ReactNode | ReactNode[];
}

export interface MobileMenuDrawerRef {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
}

export const BottomSheetBackdropComponent = (backdropComponentProps: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop
    {...backdropComponentProps}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
    pressBehavior={'close'}
    style={[backdropComponentProps.style, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
  />
);

export const MobileMenuDrawer = forwardRef<MobileMenuDrawerRef, MobileMenuDrawerProps>(
  ({ children }, ref) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const reducedMotion = useReducedMotion();

    const menuBottomSheetRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
      isMobileMenuOpen,
      setMobileMenuOpen: (open: boolean) => {
        if (open) {
          setMobileMenuOpen(true);

          menuBottomSheetRef.current?.present();
        } else {
          Keyboard.dismiss();
          setMobileMenuOpen(false);
          menuBottomSheetRef.current?.dismiss();
        }
      },
    }));

    return (
      <BottomSheetModal
        ref={menuBottomSheetRef}
        index={1}
        animateOnMount={!reducedMotion}
        onDismiss={() => {
          setMobileMenuOpen(false);
        }}
        snapPoints={['50%', '75%']}
        enableDismissOnClose
        enableHandlePanningGesture
        enableContentPanningGesture
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        stackBehavior="replace"
        backdropComponent={BottomSheetBackdropComponent}
      >
        <BottomSheetScrollView keyboardShouldPersistTaps="handled">
          {children}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);
