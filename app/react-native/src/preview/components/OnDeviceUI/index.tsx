import React, { PureComponent } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import styled from '@emotion/native';
import addons from '@storybook/addons';
import Channel from '@storybook/channels';
import StoryListView from '../StoryListView';
import StoryView from '../StoryView';
import Addons from './addons';
import Panel from './panel';
import Navigation from './navigation';
import AbsolutePositionedKeyboardAwareView, {
  PreviewDimens,
} from './absolute-positioned-keyboard-aware-view';
import { PREVIEW } from './navigation/constants';
import {
  getPreviewPosition,
  getPreviewScale,
  getAddonPanelPosition,
  getNavigatorPanelPosition,
} from './animation';
import { EmotionProps } from '../Shared/theme';

const ANIMATION_DURATION = 300;
const IS_IOS = Platform.OS === 'ios';

interface OnDeviceUIProps {
  stories: any;
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

type EmotionPreviewProps = EmotionProps & TouchableOpacityProps;

const Preview: typeof TouchableOpacity = styled.TouchableOpacity`
  flex: 1;
  border-left-width: ${(props: EmotionPreviewProps) => (props.disabled ? '0' : '1')};
  border-top-width: ${(props: EmotionPreviewProps) => (props.disabled ? '0' : '1')};
  border-right-width: ${(props: EmotionPreviewProps) => (props.disabled ? '0' : '1')};
  border-bottom-width: ${(props: EmotionPreviewProps) => (props.disabled ? '0' : '1')};
  border-color: ${(props: EmotionPreviewProps) =>
    props.disabled ? 'transparent' : props.theme.previewBorderColor};
`;

export default class OnDeviceUI extends PureComponent<OnDeviceUIProps, OnDeviceUIState> {
  animatedValue: Animated.Value;

  channel: Channel;

  constructor(props: OnDeviceUIProps) {
    super(props);
    const tabOpen = props.tabOpen || PREVIEW;
    this.state = {
      tabOpen,
      slideBetweenAnimation: false,
      previewWidth: 0,
      previewHeight: 0,
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

  render() {
    const {
      stories,
      url,
      isUIHidden,
      shouldDisableKeyboardAvoidingView,
      keyboardAvoidingViewVerticalOffset,
    } = this.props;

    const { tabOpen, slideBetweenAnimation, previewWidth, previewHeight } = this.state;

    const previewWrapperStyles = [
      { flex: 1 },
      getPreviewPosition(this.animatedValue, previewWidth, previewHeight, slideBetweenAnimation),
    ];

    const previewStyles = [{ flex: 1 }, getPreviewScale(this.animatedValue, slideBetweenAnimation)];

    return (
      <KeyboardAvoidingView
        enabled={!shouldDisableKeyboardAvoidingView || tabOpen !== PREVIEW}
        behavior={IS_IOS ? 'padding' : null}
        keyboardVerticalOffset={keyboardAvoidingViewVerticalOffset}
        style={{ flex: 1 }}
      >
        <AbsolutePositionedKeyboardAwareView
          onLayout={this.onLayout}
          previewHeight={previewHeight}
          previewWidth={previewWidth}
        >
          <Animated.View style={previewWrapperStyles}>
            <Animated.View style={previewStyles}>
              <Preview
                accessible={false}
                disabled={tabOpen === PREVIEW}
                onPress={this.handleOpenPreview}
              >
                <StoryView url={url} onDevice stories={stories} />
              </Preview>
            </Animated.View>
          </Animated.View>
          <Panel style={getNavigatorPanelPosition(this.animatedValue, previewWidth)}>
            <StoryListView stories={stories} />
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
    );
  }
}
