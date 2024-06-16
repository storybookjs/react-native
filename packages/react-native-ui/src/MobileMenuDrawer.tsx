import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { ReactNode, forwardRef, useImperativeHandle, useRef } from 'react';
import { Keyboard } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MobileMenuDrawerProps {
  children: ReactNode | ReactNode[];
  onStateChange: (isOpen: boolean) => void;
}

export interface MobileMenuDrawerRef {
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
  ({ children, onStateChange }, ref) => {
    const reducedMotion = useReducedMotion();
    const insets = useSafeAreaInsets();

    const menuBottomSheetRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
      setMobileMenuOpen: (open: boolean) => {
        if (open) {
          onStateChange(true);

          menuBottomSheetRef.current?.present();
        } else {
          Keyboard.dismiss();
          onStateChange(false);
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
          onStateChange(false);
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
        <BottomSheetScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: insets.bottom,
          }}
        >
          {children}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);
