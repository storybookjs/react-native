import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { document } from 'global';
import debounce from 'lodash.debounce';

import styled from 'react-emotion';

import { resetViewport, viewportsTransformer } from './viewportInfo';
import { SelectViewport } from './SelectViewport';
import { RotateViewport } from './RotateViewport';
import {
  SET_STORY_DEFAULT_VIEWPORT_EVENT_ID,
  CONFIGURE_VIEWPORT_EVENT_ID,
  UPDATE_VIEWPORT_EVENT_ID,
  VIEWPORT_CHANGED_EVENT_ID,
  INITIAL_VIEWPORTS,
  DEFAULT_VIEWPORT,
} from '../../shared';

import { Button } from './styles';

const storybookIframe = 'storybook-preview-iframe';
const Container = styled('div')({
  padding: 15,
  width: '100%',
  boxSizing: 'border-box',
});

const getDefaultViewport = (viewports, candidateViewport) =>
  candidateViewport in viewports ? candidateViewport : Object.keys(viewports)[0];

const getViewports = viewports =>
  Object.keys(viewports).length > 0 ? viewports : INITIAL_VIEWPORTS;

const setStoryDefaultViewportWait = 100;

export class Panel extends Component {
  static defaultOptions = {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: DEFAULT_VIEWPORT,
  };

  static propTypes = {
    channel: PropTypes.shape({}).isRequired,
    api: PropTypes.shape({}).isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      viewport: DEFAULT_VIEWPORT,
      defaultViewport: DEFAULT_VIEWPORT,
      viewports: viewportsTransformer(INITIAL_VIEWPORTS),
      isLandscape: false,
    };

    this.previousViewport = DEFAULT_VIEWPORT;

    this.setStoryDefaultViewport = debounce(
      this.setStoryDefaultViewport,
      setStoryDefaultViewportWait
    );
  }

  componentDidMount() {
    const { channel, api } = this.props;

    this.iframe = document.getElementById(storybookIframe);

    channel.on(UPDATE_VIEWPORT_EVENT_ID, this.changeViewport);
    channel.on(CONFIGURE_VIEWPORT_EVENT_ID, this.configure);
    channel.on(SET_STORY_DEFAULT_VIEWPORT_EVENT_ID, this.setStoryDefaultViewport);

    this.unsubscribeFromOnStory = api.onStory(() => {
      this.setStoryDefaultViewport(this.state.defaultViewport);
    });
  }

  componentWillUnmount() {
    const { channel } = this.props;

    if (this.unsubscribeFromOnStory) {
      this.unsubscribeFromOnStory();
    }

    channel.removeListener(UPDATE_VIEWPORT_EVENT_ID, this.changeViewport);
    channel.removeListener(CONFIGURE_VIEWPORT_EVENT_ID, this.configure);
    channel.removeListener(SET_STORY_DEFAULT_VIEWPORT_EVENT_ID, this.setStoryDefaultViewport);
  }

  setStoryDefaultViewport = viewport => {
    const { viewports } = this.state;
    const defaultViewport = getDefaultViewport(viewports, viewport);

    this.setState({
      storyDefaultViewport: defaultViewport,
    });
    this.changeViewport(defaultViewport);
  };

  configure = (options = Panel.defaultOptions) => {
    const viewports = getViewports(options.viewports);
    const defaultViewport = getDefaultViewport(viewports, options.defaultViewport);

    this.setState(
      {
        defaultViewport,
        viewport: defaultViewport,
        viewports: viewportsTransformer(viewports),
      },
      this.updateIframe
    );
  };

  iframe = undefined;

  changeViewport = viewport => {
    const { viewport: previousViewport } = this.state;

    if (previousViewport !== viewport) {
      this.setState(
        {
          viewport,
          isLandscape: false,
        },
        () => {
          this.updateIframe();
          this.emitViewportChanged();
        }
      );
    }
  };

  emitViewportChanged = () => {
    const { channel } = this.props;
    const { viewport, viewports } = this.state;

    if (!this.shouldNotify()) {
      return;
    }

    this.previousViewport = viewport;

    channel.emit(VIEWPORT_CHANGED_EVENT_ID, {
      viewport: viewports[viewport],
    });
  };

  shouldNotify = () => this.previousViewport !== this.state.viewport;

  toggleLandscape = () => {
    const { isLandscape } = this.state;

    this.setState({ isLandscape: !isLandscape }, this.updateIframe);
  };

  updateIframe = () => {
    const { viewports, viewport: viewportKey, isLandscape } = this.state;
    const viewport = viewports[viewportKey] || resetViewport;

    if (!this.iframe) {
      throw new Error('Cannot find Storybook iframe');
    }

    Object.keys(viewport.styles).forEach(prop => {
      this.iframe.style[prop] = viewport.styles[prop];
    });

    if (isLandscape) {
      this.iframe.style.height = viewport.styles.width;
      this.iframe.style.width = viewport.styles.height;
    }
  };

  render() {
    const {
      isLandscape,
      defaultViewport,
      storyDefaultViewport = defaultViewport,
      viewport,
      viewports,
    } = this.state;

    const disableDefault = viewport === storyDefaultViewport;

    return (
      <Container>
        <SelectViewport
          viewports={viewports}
          defaultViewport={storyDefaultViewport}
          activeViewport={viewport}
          onChange={e => this.changeViewport(e.target.value)}
        />

        <RotateViewport
          onClick={this.toggleLandscape}
          disabled={disableDefault}
          active={isLandscape}
        />

        <Button onClick={() => this.changeViewport(storyDefaultViewport)} disabled={disableDefault}>
          Reset Viewport
        </Button>
      </Container>
    );
  }
}
