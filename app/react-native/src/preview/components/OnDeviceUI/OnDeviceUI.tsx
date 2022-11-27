import styled from '@emotion/native';
import { StoryIndex } from '@storybook/client-api';
import React, { useState, useRef } from 'react';
import {
  Animated,
  Dimensions,
  FlexStyle,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import StoryListView from '../StoryListView';
import StoryView from '../StoryView';
import AbsolutePositionedKeyboardAwareView, {
  PreviewDimens,
} from './absolute-positioned-keyboard-aware-view';

import Addons from './addons/Addons';
import {
  getAddonPanelPosition,
  getNavigatorPanelPosition,
  getPreviewPosition,
  getPreviewScale,
} from './animation';
import Navigation from './navigation';
import { PREVIEW, ADDONS } from './navigation/constants';
import Panel from './Panel';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StoryContext } from '@storybook/csf';
import { ReactNativeFramework } from 'src/types/types-6.0';

const ANIMATION_DURATION = 300;
const IS_IOS = Platform.OS === 'ios';
// @ts-ignore: Property 'Expo' does not exist on type 'Global'
const getExpoRoot = () => global.Expo || global.__expo || global.__exponent;
export const IS_EXPO = getExpoRoot() !== undefined;
const IS_ANDROID = Platform.OS === 'android';
const BREAKPOINT = 1024;
interface OnDeviceUIProps {
  context: StoryContext<ReactNativeFramework>;
  storyIndex: StoryIndex;
  url?: string;
  tabOpen?: number;
  isUIHidden?: boolean;
  shouldDisableKeyboardAvoidingView?: boolean;
  keyboardAvoidingViewVerticalOffset?: number;
}

const flex = { flex: 1 };

const Preview = styled.View<{ disabled: boolean }>(flex, ({ disabled, theme }) => ({
  borderLeftWidth: disabled ? 0 : 1,
  borderTopWidth: disabled ? 0 : 1,
  borderRightWidth: disabled ? 0 : 1,
  borderBottomWidth: disabled ? 0 : 1,
  borderColor: disabled ? 'transparent' : theme.previewBorderColor,
}));

const absolutePosition: FlexStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

const styles = StyleSheet.create({
  expoAndroidContainer: { paddingTop: StatusBar.currentHeight },
});

const OnDeviceUI = ({
  context,
  storyIndex,
  isUIHidden,
  shouldDisableKeyboardAvoidingView,
  keyboardAvoidingViewVerticalOffset,
  tabOpen: initialTabOpen,
}: OnDeviceUIProps) => {
  const [tabOpen, setTabOpen] = useState(initialTabOpen || PREVIEW);
  const [slideBetweenAnimation, setSlideBetweenAnimation] = useState(false);
  const [previewDimensions, setPreviewDimensions] = useState<PreviewDimens>({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });
  const animatedValue = useRef(new Animated.Value(tabOpen));
  const wide = useWindowDimensions().width >= BREAKPOINT;
  const insets = useSafeAreaInsets();
  const [isUIVisible, setIsUIVisible] = useState(isUIHidden !== undefined ? !isUIHidden : true);

  const handleToggleTab = (newTabOpen: number) => {
    if (newTabOpen === tabOpen) {
      return;
    }
    Animated.timing(animatedValue.current, {
      toValue: newTabOpen,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
    setTabOpen(newTabOpen);
    const isSwipingBetweenNavigatorAndAddons = tabOpen + newTabOpen === PREVIEW;
    setSlideBetweenAnimation(isSwipingBetweenNavigatorAndAddons);

    // close the keyboard opened from a TextInput from story list or knobs
    if (newTabOpen === PREVIEW) {
      Keyboard.dismiss();
    }
  };

  const noSafeArea = context?.parameters?.noSafeArea ?? false;
  const previewWrapperStyles = [
    flex,
    getPreviewPosition({
      animatedValue: animatedValue.current,
      previewDimensions,
      slideBetweenAnimation,
      wide,
      noSafeArea,
      insets,
    }),
  ];

  const previewStyles = [flex, getPreviewScale(animatedValue.current, slideBetweenAnimation, wide)];

  const WrapperView = noSafeArea ? View : SafeAreaView;
  const wrapperMargin = { marginBottom: isUIVisible ? insets.bottom + 40 : 0 };
  return (
    <>
      <View style={[flex, IS_ANDROID && IS_EXPO && styles.expoAndroidContainer]}>
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
              <Animated.View style={previewStyles}>
                <Preview disabled={tabOpen === PREVIEW}>
                  <WrapperView style={[flex, wrapperMargin]}>
                    <StoryView context={context} />
                  </WrapperView>
                </Preview>
                {tabOpen !== PREVIEW ? (
                  <TouchableOpacity
                    style={absolutePosition}
                    onPress={() => handleToggleTab(PREVIEW)}
                  />
                ) : null}
              </Animated.View>
            </Animated.View>
            <Panel
              style={getNavigatorPanelPosition(
                animatedValue.current,
                previewDimensions.width,
                wide
              )}
            >
              <StoryListView storyIndex={storyIndex} selectedStoryContext={context} />
            </Panel>

            <Panel
              style={[
                getAddonPanelPosition(animatedValue.current, previewDimensions.width, wide),
                wrapperMargin,
              ]}
            >
              <Addons active={tabOpen === ADDONS} />
            </Panel>
          </AbsolutePositionedKeyboardAwareView>
        </KeyboardAvoidingView>
        <Navigation
          tabOpen={tabOpen}
          onChangeTab={handleToggleTab}
          isUIVisible={isUIVisible}
          setIsUIVisible={setIsUIVisible}
        />
      </View>
    </>
  );
};
export default React.memo(OnDeviceUI);
