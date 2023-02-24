import { StoryIndex } from '@storybook/client-api';
import styled from '@emotion/native';
import { useTheme } from 'emotion-theming';
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
import { useStoryContextParam } from '../../../hooks';
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

const ANIMATION_DURATION = 400;
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
  isUIHidden?: boolean;
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
  const theme: any = useTheme();
  const containerStyle = {
    backgroundColor: theme.backgroundColor,
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
  backgroundColor: theme.backgroundColor,
  ...(IS_ANDROID && IS_EXPO ? styles.expoAndroidContainer : undefined),
}));

const OnDeviceUI = ({
  storyIndex,
  isUIHidden,
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
  const [isUIVisible, setIsUIVisible] = useState(isUIHidden !== undefined ? !isUIHidden : true);

  const handleToggleTab = React.useCallback(
    (newTabOpen: number) => {
      if (newTabOpen === tabOpen) {
        return;
      }
      lastTabOpen.current = tabOpen;
      Animated.timing(animatedValue.current, {
        toValue: newTabOpen,
        duration: ANIMATION_DURATION,
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
    marginBottom: isUIVisible ? insets.bottom + navBarHeight : noSafeArea ? 0 : insets.bottom,
    marginTop: !noSafeArea ? insets.top : 0,
  };
  return (
    <>
      <Container>
        <KeyboardAvoidingView
          enabled={!shouldDisableKeyboardAvoidingView || tabOpen !== PREVIEW}
          behavior={IS_IOS ? 'padding' : null}
          keyboardVerticalOffset={keyboardAvoidingViewVerticalOffset}
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
              style={getNavigatorPanelPosition(
                animatedValue.current,
                previewDimensions.width,
                wide
              )}
            >
              <StoryListView storyIndex={storyIndex} />
            </Panel>

            <Panel
              style={[
                getAddonPanelPosition(animatedValue.current, previewDimensions.width, wide),
                safeAreaMargins,
              ]}
            >
              <Addons active={tabOpen === ADDONS} />
            </Panel>
          </AbsolutePositionedKeyboardAwareView>
        </KeyboardAvoidingView>
        <Navigation
          onLayout={measureNavigation}
          tabOpen={tabOpen}
          onChangeTab={handleToggleTab}
          isUIVisible={isUIVisible}
          setIsUIVisible={setIsUIVisible}
        />
      </Container>
    </>
  );
};
export default React.memo(OnDeviceUI);
