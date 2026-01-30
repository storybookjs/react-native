import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useTheme } from '@storybook/react-native-theming';
import {
  forwardRef,
  memo,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Keyboard, Platform } from 'react-native';
import { useAnimatedStyle, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelectedNode } from './SelectedNodeProvider';

interface MobileMenuDrawerProps {
  children: ReactNode | ReactNode[];
}

export interface MobileMenuDrawerRef {
  setMobileMenuOpen: (isOpen: boolean) => void;
}

export const BottomSheetBackdropComponent = (backdropComponentProps: BottomSheetBackdropProps) => {
  const androidTouchEventFix = useAnimatedStyle(() => {
    if (Platform.OS === 'android') {
      return {
        zIndex: backdropComponentProps.animatedIndex.value >= 0 ? 0 : -1,
      };
    }
    return {};
  });

  return (
    <BottomSheetBackdrop
      {...backdropComponentProps}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior={'close'}
      style={[
        backdropComponentProps.style,
        androidTouchEventFix,
        {
          backgroundColor: 'rgba(0,0,0,0.5)',
          paddingTop: Platform.OS === 'android' ? 1 : undefined,
        },
      ]}
    />
  );
};

const snapPoints = ['50%', '75%'];

export const MobileMenuDrawer = memo(
  forwardRef<MobileMenuDrawerRef, MobileMenuDrawerProps>(({ children }, ref) => {
    const reducedMotion = useReducedMotion();
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const menuBottomSheetRef = useRef<BottomSheet>(null);
    const { scrollToSelectedNode, scrollRef } = useSelectedNode();
    const shouldScrollOnOpen = useRef(false);

    const handleSheetChange = useCallback(
      (index: number) => {
        if (index >= 0 && shouldScrollOnOpen.current) {
          shouldScrollOnOpen.current = false;
          scrollToSelectedNode();
        }
      },
      [scrollToSelectedNode]
    );

    useImperativeHandle(ref, () => ({
      setMobileMenuOpen: (open: boolean) => {
        if (open) {
          shouldScrollOnOpen.current = true;
          menuBottomSheetRef.current?.snapToIndex(1);
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
        onChange={handleSheetChange}
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
