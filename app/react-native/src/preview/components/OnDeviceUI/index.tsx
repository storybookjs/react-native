import styled from '@emotion/native';
import addons from '@storybook/addons';
import Channel from '@storybook/channels';
import { StoryStore } from '@storybook/client-api';
import React, { PureComponent } from 'react';
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
} from 'react-native';
import StoryListView from '../StoryListView';
import StoryView from '../StoryView';
import AbsolutePositionedKeyboardAwareView, {
  PreviewDimens,
} from './absolute-positioned-keyboard-aware-view';
import Addons from './addons';
import {
  getAddonPanelPosition,
  getNavigatorPanelPosition,
  getPreviewPosition,
  getPreviewScale,
} from './animation';
import Navigation from './navigation';
import { PREVIEW } from './navigation/constants';
import Panel from './panel';

const ANIMATION_DURATION = 300;
const IS_IOS = Platform.OS === 'ios';
// @ts-ignore: Property 'Expo' does not exist on type 'Global'
// eslint-disable-next-line no-underscore-dangle
const getExpoRoot = () => global.Expo || global.__expo || global.__exponent;
export const IS_EXPO = getExpoRoot() !== undefined;
const IS_ANDROID = Platform.OS === 'android';

// @ts-ignore: Property 'Expo' does not exist on type 'Global'
// eslint-disable-next-line no-underscore-dangle
const getExpoRoot = () => global.Expo || global.__expo || global.__exponent;
export const IS_EXPO = getExpoRoot() !== undefined;
const IS_ANDROID = Platform.OS === 'android';

interface OnDeviceUIProps {
  storyStore: StoryStore;
  url?: string;
  tabOpen?: number;
  isUIHidden?: boolean;
  shouldDisableKeyboardAvoidingView?: boolean;
  keyboardAvoidingViewVerticalOffset?: number;
}

interface OnDeviceUIState {
  tabOpen: number;
  slideBetweenAnimation: boolean;
  previewWidth: number;
  previewHeight: number;
}

const flex = { flex: 1 };

const Preview = styled.View<{ disabled: boolean }>(flex, ({ disabled, theme }) => ({
  borderLeftWidth: disabled ? 0 : 1,
  borderTopWidth: disabled ? 0 : 1,
  borderRightWidth: disabled ? 0 : 1,
  borderBottomWidth: disabled ? 0 : 1,
  borderColor: disabled ? 'transparent' : theme.previewBorderColor || '#b3b3b3',
}));

const absolutePosition: FlexStyle = { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 };

export default class OnDeviceUI extends PureComponent<OnDeviceUIProps, OnDeviceUIState> {
  constructor(props: OnDeviceUIProps) {
    super(props);
    const tabOpen = props.tabOpen || PREVIEW;

    this.state = {
      tabOpen,
      slideBetweenAnimation: false,
      previewWidth: Dimensions.get('window').width,
      previewHeight: Dimensions.get('window').height,
    };
    this.animatedValue = new Animated.Value(tabOpen);
    this.channel = addons.getChannel();
  }

  onLayout = ({ previewWidth, previewHeight }: PreviewDimens) => {
    this.setState({ previewWidth, previewHeight });
  };

  handleOpenPreview = () => {
    this.handleToggleTab(PREVIEW);
  };

  handleToggleTab = (newTabOpen: number) => {
    const { tabOpen } = this.state;
    if (newTabOpen === tabOpen) {
      return;
    }
    Animated.timing(this.animatedValue, {
      toValue: newTabOpen,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
    this.setState({
      tabOpen: newTabOpen,
      // True if swiping between navigator and addons
      slideBetweenAnimation: tabOpen + newTabOpen === PREVIEW,
    });
    // close the keyboard opened from a TextInput from story list or knobs
    if (newTabOpen === PREVIEW) {
      Keyboard.dismiss();
    }
  };

  animatedValue: Animated.Value;

  channel: Channel;

  render() {
    const {
      storyStore,
      url,
      isUIHidden,
      shouldDisableKeyboardAvoidingView,
      keyboardAvoidingViewVerticalOffset,
    } = this.props;

    const { tabOpen, slideBetweenAnimation, previewWidth, previewHeight } = this.state;

    const previewWrapperStyles = [
      flex,
      getPreviewPosition(this.animatedValue, previewWidth, previewHeight, slideBetweenAnimation),
    ];

    const previewStyles = [flex, getPreviewScale(this.animatedValue, slideBetweenAnimation)];

    return (
      <SafeAreaView
        style={[flex, { paddingTop: IS_ANDROID && IS_EXPO ? StatusBar.currentHeight : 0 }]}
      >
        <KeyboardAvoidingView
          enabled={!shouldDisableKeyboardAvoidingView || tabOpen !== PREVIEW}
          behavior={IS_IOS ? 'padding' : null}
          keyboardVerticalOffset={keyboardAvoidingViewVerticalOffset}
          style={flex}
        >
          <AbsolutePositionedKeyboardAwareView
            onLayout={this.onLayout}
            previewHeight={previewHeight}
            previewWidth={previewWidth}
          >
            <Animated.View style={previewWrapperStyles}>
              <Animated.View style={previewStyles}>
                <Preview disabled={tabOpen === PREVIEW}>
                  <StoryView url={url} onDevice storyStore={storyStore} />
                </Preview>
                {tabOpen !== PREVIEW ? (
                  <TouchableOpacity style={absolutePosition} onPress={this.handleOpenPreview} />
                ) : null}
              </Animated.View>
            </Animated.View>
            <Panel style={getNavigatorPanelPosition(this.animatedValue, previewWidth)}>
              <StoryListView storyStore={storyStore} />
            </Panel>
            <Panel style={getAddonPanelPosition(this.animatedValue, previewWidth)}>
              <Addons />
            </Panel>
          </AbsolutePositionedKeyboardAwareView>
          <Navigation
            tabOpen={tabOpen}
            onChangeTab={this.handleToggleTab}
            initialUiVisible={!isUIHidden}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
