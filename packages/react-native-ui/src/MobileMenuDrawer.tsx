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
import { useTheme } from '@storybook/react-native-theming';

interface MobileMenuDrawerProps {
  children: ReactNode | ReactNode[];
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
  ({ children }, ref) => {
    const reducedMotion = useReducedMotion();
    const insets = useSafeAreaInsets();
    const theme = useTheme();

    const menuBottomSheetRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
      setMobileMenuOpen: (open: boolean) => {
        if (open) {
          menuBottomSheetRef.current?.present();
        } else {
          Keyboard.dismiss();

          menuBottomSheetRef.current?.dismiss();
        }
      },
    }));

    return (
      <BottomSheetModal
        ref={menuBottomSheetRef}
        index={1}
        animateOnMount={!reducedMotion}
        snapPoints={['50%', '75%']}
        enableDismissOnClose
        enableHandlePanningGesture
        enableContentPanningGesture
        enableDynamicSizing={false}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        stackBehavior="replace"
        backdropComponent={BottomSheetBackdropComponent}
        backgroundStyle={{ backgroundColor: theme.background.content }}
        handleIndicatorStyle={{ backgroundColor: theme.textMutedColor }}
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
