import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, KeyboardAvoidingView, Platform, Animated, TouchableOpacity } from 'react-native';
import Events from '@storybook/core-events';

import StoryListView from '../StoryListView';
import StoryView from '../StoryView';
import Addons from './addons';
import Panel from './panel';
import Navigation from './navigation';
import AbsolutePositionedKeyboardAwareView from './absolute-positioned-keyboard-aware-view';

import { PREVIEW } from './navigation/consts';

import {
  getPreviewPosition,
  getPreviewScale,
  getAddonPanelPosition,
  getNavigatorPanelPosition,
} from './animation';

import style from './style';

const ANIMATION_DURATION = 300;
const IS_IOS = Platform.OS === 'ios';

export default class OnDeviceUI extends PureComponent {
  constructor(props) {
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
    this.forceRender = this.forceUpdate.bind(this);
  }

  async componentWillMount() {
    const { events, getInitialStory } = this.props;

    if (getInitialStory) {
      const story = await getInitialStory();

      this.setState({
        selection: story || {},
        storyFn: story ? story.storyFn : null,
      });
    }

    events.on(Events.SELECT_STORY, this.handleStoryChange);
    events.on(Events.FORCE_RE_RENDER, this.forceRender);
  }

  componentWillUnmount() {
    const { events } = this.props;
    events.removeListener(Events.SELECT_STORY, this.handleStoryChange);
    events.removeListener(Events.FORCE_RE_RENDER, this.forceRender);
  }

  onLayout = ({ previewWidth, previewHeight }) => {
    this.setState({ previewWidth, previewHeight });
  };

  handleOpenPreview = () => {
    this.handleToggleTab(PREVIEW);
  };

  handleStoryChange = selection => {
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

  handleToggleTab = newTabOpen => {
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
      events,
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
                <StoryView url={url} events={events} selection={selection} storyFn={storyFn} />
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
          <Panel style={getNavigatorPanelPosition(this.animatedValue, previewWidth)}>
            <StoryListView
              stories={stories}
              events={events}
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

OnDeviceUI.propTypes = {
  stories: PropTypes.shape({
    dumpStoryBook: PropTypes.func.isRequired,
    on: PropTypes.func.isRequired,
    emit: PropTypes.func.isRequired,
    removeListener: PropTypes.func.isRequired,
  }).isRequired,
  events: PropTypes.shape({
    on: PropTypes.func.isRequired,
    emit: PropTypes.func.isRequired,
    removeListener: PropTypes.func.isRequired,
  }).isRequired,
  url: PropTypes.string,
  tabOpen: PropTypes.number,
  isUIHidden: PropTypes.bool,
  getInitialStory: PropTypes.func,
  shouldDisableKeyboardAvoidingView: PropTypes.bool,
  keyboardAvoidingViewVerticalOffset: PropTypes.number,
};

OnDeviceUI.defaultProps = {
  url: '',
  tabOpen: 0,
  isUIHidden: false,
  getInitialStory: null,
  shouldDisableKeyboardAvoidingView: false,
  keyboardAvoidingViewVerticalOffset: 0,
};
