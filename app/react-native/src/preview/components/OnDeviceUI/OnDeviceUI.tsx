import styled from '@emotion/native';
import { addons } from '@storybook/addons';
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
  StyleSheet,
} from 'react-native';
import Events from '@storybook/core-events';
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

const ANIMATION_DURATION = 300;
const IS_IOS = Platform.OS === 'ios';
// @ts-ignore: Property 'Expo' does not exist on type 'Global'
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
  storyId: string;
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

export default class OnDeviceUI extends PureComponent<OnDeviceUIProps, OnDeviceUIState> {
  constructor(props: OnDeviceUIProps) {
    super(props);
    const tabOpen = props.tabOpen || PREVIEW;
    const storyId = props.storyStore.getSelection()?.storyId || '';
    this.state = {
      tabOpen,
      slideBetweenAnimation: false,
      previewWidth: Dimensions.get('window').width,
      previewHeight: Dimensions.get('window').height,
      storyId,
    };
    this.animatedValue = new Animated.Value(tabOpen);
    this.channel = addons.getChannel();
  }

  componentDidMount() {
    const channel = addons.getChannel();
    channel.on(Events.SET_CURRENT_STORY, this.handleStoryWasSet);
    //TODO: update preview without force
    channel.on(Events.FORCE_RE_RENDER, () => this.forceUpdate());
  }

  componentWillUnmount() {
    const channel = addons.getChannel();
    channel.removeListener(Events.SET_CURRENT_STORY, this.handleStoryWasSet);
  }

  onLayout = ({ previewWidth, previewHeight }: PreviewDimens) => {
    this.setState({ previewWidth, previewHeight });
  };

  handleStoryWasSet = ({ storyId }: { storyId: string }) => {
    this.setState({ storyId });
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
      isUIHidden,
      shouldDisableKeyboardAvoidingView,
      keyboardAvoidingViewVerticalOffset,
    } = this.props;

    const { storyId } = this.state;

    const story = storyStore.fromId(storyId);

    const { tabOpen, slideBetweenAnimation, previewWidth, previewHeight } = this.state;

    const previewWrapperStyles = [
      flex,
      getPreviewPosition(this.animatedValue, previewWidth, previewHeight, slideBetweenAnimation),
    ];

    const previewStyles = [flex, getPreviewScale(this.animatedValue, slideBetweenAnimation)];

    return (
      <SafeAreaView style={[flex, IS_ANDROID && IS_EXPO && styles.expoAndroidContainer]}>
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
                  <StoryView story={story} />
                </Preview>
                {tabOpen !== PREVIEW ? (
                  <TouchableOpacity style={absolutePosition} onPress={this.handleOpenPreview} />
                ) : null}
              </Animated.View>
            </Animated.View>
            <Panel style={getNavigatorPanelPosition(this.animatedValue, previewWidth)}>
              <StoryListView storyStore={storyStore} selectedStory={story} />
            </Panel>
            <Panel style={getAddonPanelPosition(this.animatedValue, previewWidth)}>
              <Addons active={tabOpen === ADDONS} />
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
