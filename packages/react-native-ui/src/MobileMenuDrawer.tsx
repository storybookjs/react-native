import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  type BottomSheetBackgroundProps,
  BottomSheetHandle,
  type BottomSheetHandleProps,
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
  useState,
} from 'react';
import { Keyboard, Platform, View, type ViewStyle } from 'react-native';
import { useAnimatedStyle, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelectedNode } from './SelectedNodeProvider';

interface MobileMenuDrawerProps {
  children: ReactNode | ReactNode[];
}

export interface MobileMenuDrawerRef {
  setMobileMenuOpen: (isOpen: boolean) => void;
}

// @gorhom/bottom-sheet marks the sheet's content, handle, background and backdrop as accessible
// elements labelled "Bottom Sheet" (or similar) with no actions behind them. On iOS that
// collapses the story list into one element and leaves extra empty elements in the tree.
// @see https://github.com/storybookjs/react-native/issues/942
const hiddenFromAccessibility = {
  accessible: false,
  accessibilityLabel: null,
  accessibilityRole: null,
  accessibilityHint: null,
} as const;

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
      {...hiddenFromAccessibility}
      style={[
        backdropComponentProps.style,
        androidTouchEventFix as unknown as ViewStyle,
        {
          backgroundColor: 'rgba(0,0,0,0.5)',
          paddingTop: Platform.OS === 'android' ? 1 : undefined,
        },
      ]}
    />
  );
};

const BottomSheetHandleComponent = (handleProps: BottomSheetHandleProps) => (
  <BottomSheetHandle {...handleProps} {...hiddenFromAccessibility} />
);

// Same look as the library's default background, which hardcodes its accessibility props.
const BottomSheetBackgroundComponent = ({ pointerEvents, style }: BottomSheetBackgroundProps) => (
  <View pointerEvents={pointerEvents} style={[{ borderRadius: 15 }, style]} />
);

const snapPoints = ['50%', '75%'];

export const MobileMenuDrawer = memo(
  forwardRef<MobileMenuDrawerRef, MobileMenuDrawerProps>(({ children }, ref) => {
    const reducedMotion = useReducedMotion();
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const menuBottomSheetRef = useRef<BottomSheet>(null);
    const { scrollToSelectedNode, scrollRef } = useSelectedNode();
    const shouldScrollOnOpen = useRef(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSheetChange = useCallback(
      (index: number) => {
        setIsOpen(index >= 0);

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
        handleComponent={BottomSheetHandleComponent}
        backgroundComponent={BottomSheetBackgroundComponent}
        backgroundStyle={bgColorStyle}
        handleIndicatorStyle={handleIndicatorStyle}
        onChange={handleSheetChange}
        {...hiddenFromAccessibility}
      >
        <BottomSheetScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={contentContainerStyle}
          accessibilityElementsHidden={!isOpen}
          importantForAccessibility={isOpen ? 'auto' : 'no-hide-descendants'}
        >
          {children}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  })
);
