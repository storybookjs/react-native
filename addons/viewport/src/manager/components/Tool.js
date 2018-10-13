import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { document } from 'global';
import styled from '@emotion/styled';

import { Popout, Item, Icons, IconButton, Title, List } from '@storybook/components';

import { resetViewport, viewportsTransformer } from './viewportInfo';
import {
  SET_STORY_DEFAULT_VIEWPORT_EVENT_ID,
  CONFIGURE_VIEWPORT_EVENT_ID,
  UPDATE_VIEWPORT_EVENT_ID,
  VIEWPORT_CHANGED_EVENT_ID,
  INITIAL_VIEWPORTS,
  DEFAULT_VIEWPORT,
} from '../../shared';

const storybookIframe = 'storybook-preview-iframe';
const Container = styled.div({
  padding: 15,
  width: '100%',
  boxSizing: 'border-box',
});
Container.displayName = 'Container';

const getDefaultViewport = (viewports, candidateViewport) =>
  candidateViewport in viewports ? candidateViewport : Object.keys(viewports)[0];

const getViewports = viewports =>
  Object.keys(viewports).length > 0 ? viewports : INITIAL_VIEWPORTS;

export default class ViewportTool extends Component {
  static defaultOptions = {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: DEFAULT_VIEWPORT,
  };

  iframe = undefined;

  previousViewport = DEFAULT_VIEWPORT;

  static propTypes = {
    api: PropTypes.shape({
      selectStory: PropTypes.func.isRequired,
    }).isRequired,
    channel: PropTypes.shape({
      on: PropTypes.func,
      emit: PropTypes.func,
      removeListener: PropTypes.func,
    }).isRequired,
  };

  state = {
    viewport: DEFAULT_VIEWPORT,
    defaultViewport: DEFAULT_VIEWPORT,
    viewports: viewportsTransformer(INITIAL_VIEWPORTS),
  };

  componentDidMount() {
    this.mounted = true;
    const { channel, api } = this.props;
    const { defaultViewport } = this.state;

    channel.on(UPDATE_VIEWPORT_EVENT_ID, this.changeViewport);
    channel.on(CONFIGURE_VIEWPORT_EVENT_ID, this.configure);
    channel.on(SET_STORY_DEFAULT_VIEWPORT_EVENT_ID, this.setStoryDefaultViewport);

    this.unsubscribeFromOnStory = api.onStory(() => {
      const { storyDefaultViewport } = this.state;
      if (this.mounted && !storyDefaultViewport === defaultViewport) {
        this.setStoryDefaultViewport(defaultViewport);
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    const { channel } = this.props;

    this.unsubscribeFromOnStory();

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

  configure = (options = ViewportTool.defaultOptions) => {
    this.iframe = document.getElementById(storybookIframe);
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

  changeViewport = viewport => {
    const { viewport: previousViewport } = this.state;

    if (previousViewport !== viewport) {
      this.setState(
        {
          viewport,
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

  shouldNotify = () => {
    const { viewport } = this.state;

    return this.previousViewport !== viewport;
  };

  updateIframe = () => {
    const { viewports, viewport: viewportKey } = this.state;
    const viewport = viewports[viewportKey] || resetViewport;

    if (!this.iframe) {
      throw new Error('Cannot find Storybook iframe');
    }

    Object.keys(viewport.styles).forEach(prop => {
      this.iframe.style[prop] = viewport.styles[prop];
    });
  };

  render() {
    const { viewports } = this.state;

    return (
      <Fragment>
        <Popout key="viewports">
          <IconButton key="viewport" title="Change Viewport">
            <Icons icon="grow" />
          </IconButton>
          {({ hide }) => (
            <List>
              {Object.entries(viewports).map(([key, { name }]) => (
                <Item
                  key={key}
                  onClick={() => {
                    this.changeViewport(key);

                    hide();
                  }}
                >
                  <Title>{name}</Title>
                </Item>
              ))}
            </List>
          )}
        </Popout>
      </Fragment>
    );
  }
}
