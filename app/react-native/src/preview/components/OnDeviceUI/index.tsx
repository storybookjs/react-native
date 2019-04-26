import React, { PureComponent } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Animated, TouchableOpacity } from 'react-native';
import Events from '@storybook/core-events';
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
import style from './style';

const ANIMATION_DURATION = 300;
const IS_IOS = Platform.OS === 'ios';

interface OnDeviceUIProps {
  stories: any;
  url?: string;
  tabOpen?: number;
  isUIHidden?: boolean;
  getInitialStory?: (...args: any[]) => any;
  shouldDisableKeyboardAvoidingView?: boolean;
  keyboardAvoidingViewVerticalOffset?: number;
}

interface OnDeviceUIState {
  selection: any;
  storyFn: any;
  tabOpen: number;
  slideBetweenAnimation: boolean;
  previewWidth: number;
  previewHeight: number;
}

export default class OnDeviceUI extends PureComponent<OnDeviceUIProps, OnDeviceUIState> {
  animatedValue: Animated.Value;
  channel: Channel;

  constructor(props: OnDeviceUIProps) {
    super(props);
    const tabOpen = props.tabOpen || PREVIEW;
    this.state = {
      tabOpen,
      slideBetweenAnimation: false,
      selection: {},
      storyFn: null,
      previewWidth: 0,
      previewHeight: 0,
    };
    this.animatedValue = new Animated.Value(tabOpen);
    this.channel = addons.getChannel();
  }

  async componentWillMount() {
    const { getInitialStory } = this.props;
    if (getInitialStory) {
      const story = await getInitialStory();
      this.setState({
        selection: story || {},
        storyFn: story ? story.storyFn : null,
      });
    }
    this.channel.on(Events.SELECT_STORY, this.handleStoryChange);
    this.channel.on(Events.FORCE_RE_RENDER, this.forceReRender);
  }

  componentWillUnmount() {
    this.channel.removeListener(Events.SELECT_STORY, this.handleStoryChange);
    this.channel.removeListener(Events.FORCE_RE_RENDER, this.forceReRender);
  }

  onLayout = ({ previewWidth, previewHeight }: PreviewDimens) => {
    this.setState({ previewWidth, previewHeight });
  };

  handleOpenPreview = () => {
    this.handleToggleTab(PREVIEW);
  };

  forceReRender = () => {
    this.forceUpdate();
  };

  handleStoryChange = (selection: any) => {
    const { selection: prevSelection } = this.state;
    if (selection.kind === prevSelection.kind && selection.story === prevSelection.story) {
      this.handleToggleTab(PREVIEW);
    }
    this.setState({
      selection: {
        kind: selection.kind,
        story: selection.story,
      },
      storyFn: selection.storyFn,
    });
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

    const {
      tabOpen,
      slideBetweenAnimation,
      selection,
      storyFn,
      previewWidth,
      previewHeight,
    } = this.state;

    const previewWrapperStyles = [
      style.flex,
      getPreviewPosition(this.animatedValue, previewWidth, previewHeight, slideBetweenAnimation),
    ];

    const previewStyles = [
      style.flex,
      tabOpen !== 0 && style.previewMinimized,
      getPreviewScale(this.animatedValue, slideBetweenAnimation),
    ];

    return (
      <KeyboardAvoidingView
        enabled={!shouldDisableKeyboardAvoidingView || tabOpen !== PREVIEW}
        behavior={IS_IOS ? 'padding' : null}
        keyboardVerticalOffset={keyboardAvoidingViewVerticalOffset}
        style={style.flex}
      >
        <AbsolutePositionedKeyboardAwareView
          onLayout={this.onLayout}
          previewHeight={previewHeight}
          previewWidth={previewWidth}
        >
          <Animated.View style={previewWrapperStyles}>
            <Animated.View style={previewStyles}>
              <TouchableOpacity
                accessible={false}
                style={style.flex}
                disabled={tabOpen === PREVIEW}
                onPress={this.handleOpenPreview}
              >
                <StoryView
                  url={url}
                  selection={selection}
                  storyFn={storyFn}
                  listenToEvents={false}
                />
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
          <Panel style={getNavigatorPanelPosition(this.animatedValue, previewWidth)}>
            <StoryListView
              stories={stories}
              selectedKind={selection.kind}
              selectedStory={selection.story}
            />
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
