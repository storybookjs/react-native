import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { ReactNode, forwardRef, memo, useImperativeHandle, useMemo, useRef } from 'react';
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

const snapPoints = ['50%', '75%'];

export const MobileMenuDrawer = memo(
  forwardRef<MobileMenuDrawerRef, MobileMenuDrawerProps>(({ children }, ref) => {
    const reducedMotion = useReducedMotion();
    const insets = useSafeAreaInsets();
    const theme = useTheme();

    const menuBottomSheetRef = useRef<BottomSheet>(null);

    useImperativeHandle(ref, () => ({
      setMobileMenuOpen: (open: boolean) => {
        if (open) {
          // menuBottomSheetRef.current?.present();
          menuBottomSheetRef.current?.snapToIndex(1);
        } else {
          Keyboard.dismiss();

          // menuBottomSheetRef.current?.dismiss();
          menuBottomSheetRef.current?.close();
        }
      },
    }));

    const bgColorStyle = useMemo(() => {
      return { backgroundColor: theme.background.content };
    }, [theme.background.content]);

    const handleIndicatorStyle = useMemo(() => {
      return { backgroundColor: theme.textMutedColor };
    }, [theme.textMutedColor]);

    const contentContainerStyle = useMemo(() => {
      return { paddingBottom: insets.bottom };
    }, [insets.bottom]);

    return (
      <BottomSheet
        ref={menuBottomSheetRef}
        index={-1}
        animateOnMount={!reducedMotion}
        snapPoints={snapPoints}
        // enableDismissOnClose
        enableHandlePanningGesture
        enableContentPanningGesture
        enableDynamicSizing={false}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        enablePanDownToClose
        // stackBehavior="replace"
        backdropComponent={BottomSheetBackdropComponent}
        backgroundStyle={bgColorStyle}
        handleIndicatorStyle={handleIndicatorStyle}
      >
        <BottomSheetScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={contentContainerStyle}
        >
          {children}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  })
);
