import { StoryIndex } from '@storybook/client-api';
import styled from '@emotion/native';
import React, { useState, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {
  useIsUIVisible,
  useStoryContextParam,
  useTheme,
} from '../../../hooks';
import { ANIMATION_DURATION_TRANSITION } from '../../../constants';
import StoryListView from '../StoryListView';
import StoryView from '../StoryView';
import AbsolutePositionedKeyboardAwareView, {
  PreviewDimens,
} from './absolute-positioned-keyboard-aware-view';

import Addons from './addons/Addons';
import {
  getAddonPanelPosition,
  getNavigatorPanelPosition,
  getPreviewShadowStyle,
  getPreviewStyle,
} from './animation';
import Navigation from './navigation';
import { PREVIEW, ADDONS } from './navigation/constants';
import Panel from './Panel';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const IS_IOS = Platform.OS === 'ios';
// @ts-ignore: Property 'Expo' does not exist on type 'Global'
const getExpoRoot = () => global.Expo || global.__expo || global.__exponent;
export const IS_EXPO = getExpoRoot() !== undefined;
const IS_ANDROID = Platform.OS === 'android';
const BREAKPOINT = 1024;

interface OnDeviceUIProps {
  storyIndex: StoryIndex;
  url?: string;
  tabOpen?: number;
  shouldDisableKeyboardAvoidingView?: boolean;
  keyboardAvoidingViewVerticalOffset?: number;
}

const flex = { flex: 1 };

interface PreviewProps {
  animatedValue: Animated.Value;
  style: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * Story preview container.
 */
function Preview({ animatedValue, style, children }: PreviewProps) {
  const theme = useTheme();
  const containerStyle = {
    backgroundColor: theme.preview.backgroundColor,
    ...getPreviewShadowStyle(animatedValue),
  };
  return (
    <Animated.View style={[flex, containerStyle]}>
      <View style={[flex, style]}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  expoAndroidContainer: { paddingTop: StatusBar.currentHeight },
});

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.preview.containerBackgroundColor,
  ...(IS_ANDROID && IS_EXPO ? styles.expoAndroidContainer : undefined),

  ...Platform.select({ web: { overflow: 'hidden' } }),
}));

const OnDeviceUI = ({
  storyIndex,
  shouldDisableKeyboardAvoidingView,
  keyboardAvoidingViewVerticalOffset,
  tabOpen: initialTabOpen,
}: OnDeviceUIProps) => {
  const [tabOpen, setTabOpen] = useState(initialTabOpen || PREVIEW);
  const lastTabOpen = React.useRef(tabOpen);
  const [previewDimensions, setPreviewDimensions] = useState<PreviewDimens>(() => ({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }));
  const animatedValue = useRef(new Animated.Value(tabOpen));
  const wide = useWindowDimensions().width >= BREAKPOINT;
  const insets = useSafeAreaInsets();

  const handleToggleTab = React.useCallback(
    (newTabOpen: number) => {
      if (newTabOpen === tabOpen) {
        return;
      }
      lastTabOpen.current = tabOpen;
      Animated.timing(animatedValue.current, {
        toValue: newTabOpen,
        duration: ANIMATION_DURATION_TRANSITION,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start();
      setTabOpen(newTabOpen);

      // close the keyboard opened from a TextInput from story list or knobs
      if (newTabOpen === PREVIEW) {
        Keyboard.dismiss();
      }
    },
    [tabOpen]
  );

  const noSafeArea = useStoryContextParam<boolean>('noSafeArea', false);
  const previewWrapperStyles = [
    flex,
    getPreviewStyle({
      animatedValue: animatedValue.current,
      previewDimensions,
      wide,
      insets,
      tabOpen,
      lastTabOpen: lastTabOpen.current,
    }),
  ];

  const [isUIVisible] = useIsUIVisible();
  // The initial value is just a guess until the layout calculation has been done.
  const [navBarHeight, setNavBarHeight] = React.useState(insets.bottom + 40);
  const measureNavigation = React.useCallback(
    ({ nativeEvent }) => {
      const inset = insets.bottom;
      setNavBarHeight(isUIVisible ? nativeEvent.layout.height - inset : 0);
    },
    [isUIVisible, insets]
  );

  // There are 4 cases for the additional UI margin:
  //   1. Storybook UI is visible, and `noSafeArea` is false: Include top and
  //      bottom safe area insets, and also include the navigation bar height.
  //
  //   2. Storybook UI is not visible, and `noSafeArea` is false: Include top
  //      and bottom safe area insets.
  //
  //   3. Storybook UI is visible, and `noSafeArea` is true: Include only the
  //      bottom safe area inset and the navigation bar height.
  //
  //   4. Storybook UI is not visible, and `noSafeArea` is true: No margin.
  const safeAreaMargins = {
    paddingBottom: isUIVisible ? insets.bottom + navBarHeight : noSafeArea ? 0 : insets.bottom,
    paddingTop: !noSafeArea ? insets.top : 0,
  };
  // The panels always apply the safe area, regardless of the story parameters.
  const panelSafeAreaMargins = {
    paddingBottom: insets.bottom + navBarHeight,
    paddingTop: insets.top,
  };
  // Adjust the keyboard offset (possibly in a negative direction) to account
  // for the safe area and navigation bar.
  const keyboardVerticalOffset =
    -panelSafeAreaMargins.paddingBottom + (keyboardAvoidingViewVerticalOffset ?? 0);
  return (
    <>
      <Container>
        <KeyboardAvoidingView
          enabled={!shouldDisableKeyboardAvoidingView || tabOpen !== PREVIEW}
          behavior={IS_IOS ? 'padding' : null}
          keyboardVerticalOffset={keyboardVerticalOffset}
          style={flex}
        >
          <AbsolutePositionedKeyboardAwareView
            onLayout={setPreviewDimensions}
            previewDimensions={previewDimensions}
          >
            <Animated.View style={previewWrapperStyles}>
              <Preview style={safeAreaMargins} animatedValue={animatedValue.current}>
                <StoryView />
              </Preview>
              {tabOpen !== PREVIEW ? (
                <TouchableOpacity
                  style={StyleSheet.absoluteFillObject}
                  onPress={() => handleToggleTab(PREVIEW)}
                />
              ) : null}
            </Animated.View>
            <Panel
              edge="right"
              style={[
                getNavigatorPanelPosition(animatedValue.current, previewDimensions.width, wide),
                panelSafeAreaMargins,
              ]}
            >
              <StoryListView storyIndex={storyIndex} />
            </Panel>

            <Panel
              edge="left"
              style={[
                getAddonPanelPosition(animatedValue.current, previewDimensions.width, wide),
                panelSafeAreaMargins,
              ]}
            >
              <Addons active={tabOpen === ADDONS} />
            </Panel>
          </AbsolutePositionedKeyboardAwareView>
        </KeyboardAvoidingView>
        <Navigation onLayout={measureNavigation} tabOpen={tabOpen} onChangeTab={handleToggleTab} />
      </Container>
    </>
  );
};
export default React.memo(OnDeviceUI);
