import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types';
import { useTheme } from '@storybook/react-native-theming';
import { forwardRef, memo, ReactNode, useImperativeHandle, useMemo, useRef } from 'react';
import { Keyboard } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelectedNode } from './SelectedNodeProvider';

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
    const scrollRef = useRef<BottomSheetScrollViewMethods>(null);
    const menuBottomSheetRef = useRef<BottomSheet>(null);
    const { nodeRef } = useSelectedNode();

    useImperativeHandle(ref, () => ({
      setMobileMenuOpen: (open: boolean) => {
        if (open) {
          menuBottomSheetRef.current?.snapToIndex(1);

          setTimeout(() => {
            if (nodeRef?.current) {
              // im just not sure if older versions would error here,
              // since measure layout probably changed since new arch
              try {
                nodeRef.current.measureLayout?.(scrollRef.current as any, (_x, y) => {
                  scrollRef.current?.scrollTo({ y: y - 100, animated: true });
                });
              } catch (error) {}
            }
          }, 500);
        } else {
          Keyboard.dismiss();

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
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={contentContainerStyle}
        >
          {children}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  })
);
