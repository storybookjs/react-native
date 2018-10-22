import { window } from 'global';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Events from '@storybook/core-events';
import { types } from '@storybook/addons';

import { IconButton, Toolbar, Separator } from './toolbar';
import Icons from '../icon/icon';
import { Route } from '../router/router';
import { TabButton, TabBar } from '../tabs/tabs';

import Zoom from './tools/zoom';
import { Grid, Background } from './tools/background';
import * as S from './components';

class IFrame extends Component {
  shouldComponentUpdate() {
    // this component renders an iframe, which gets updates via post-messages
    return false;
  }

  render() {
    const { id, title, src, allowFullScreen, ...rest } = this.props;
    return (
      <iframe
        id={id}
        title={title}
        src={src}
        allowFullScreen={allowFullScreen}
        {...rest}
        style={{ border: '0 none' }}
      />
    );
  }
}
IFrame.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  allowFullScreen: PropTypes.bool.isRequired,
};

// eslint-disable-next-line react/no-multi-comp
class Preview extends Component {
  state = {
    zoom: 1,
    grid: false,
  };

  shouldComponentUpdate({ location, toolbar, options }, { zoom, grid }) {
    const { props, state } = this;

    return (
      options.isFullscreen !== props.options.isFullscreen ||
      location !== props.location ||
      toolbar !== props.toolbar ||
      zoom !== state.zoom ||
      grid !== state.grid
    );
  }

  componentDidUpdate(prevProps) {
    const { channel, location } = this.props;
    const { location: prevLocation } = prevProps;
    if (location && this.getStoryPath(location) !== this.getStoryPath(prevLocation)) {
      channel.emit(Events.SET_CURRENT_STORY, { location });
    }
  }

  getStoryPath = location => location.replace(/\/?.+\/(.+)/, '$1');

  render() {
    const { id, toolbar = true, location = '/', getElements, actions, options } = this.props;
    const { zoom, grid } = this.state;
    const panels = getElements(types.TAB);

    const toolbarHeight = toolbar ? 40 : 0;
    const panelList = Object.entries(panels).map(([key, value]) => ({ ...value, key }));
    const tabsList = [{ route: '/components/', title: 'Canvas', key: 'canvas' }].concat(
      getElements(types.TAB)
    );
    const toolList = getElements(types.TOOL);

    return (
      <Fragment>
        {toolbar ? (
          <Toolbar
            key="toolbar"
            left={[
              <TabBar key="tabs" scroll={false}>
                {tabsList.map((t, index) => (
                  <S.UnstyledLink
                    key={t.key || index}
                    to={location.replace(/^\/(components|info)\//, t.route)}
                  >
                    <TabButton>{t.title}</TabButton>
                  </S.UnstyledLink>
                ))}
              </TabBar>,
              <Separator key="1" />,
              <Zoom
                key="zoom"
                current={zoom}
                set={v => this.setState({ zoom: zoom * v })}
                reset={() => this.setState({ zoom: 1 })}
              />,
              <Separator key="2" />,
              <IconButton active={!!grid} key="grid" onClick={() => this.setState({ grid: !grid })}>
                <Icons icon="grid" />
              </IconButton>,
              ...toolList.map((t, index) => <Fragment key={`t${index}`}>{t.render()}</Fragment>),
            ]}
            right={[
              <Separator key="1" />,
              <IconButton key="full" onClick={actions.toggleFullscreen}>
                <Icons icon={options.isFullscreen ? 'cross' : 'expand'} />
              </IconButton>,
              <Separator key="2" />,
              <IconButton key="opener" onClick={() => window.open(`iframe.html?path=${location}`)}>
                <Icons icon="share" />
              </IconButton>,
            ]}
          />
        ) : null}
        <S.FrameWrap key="frame" offset={toolbarHeight}>
          <Route path="components" startsWith hideOnly>
            <S.Frame
              style={{
                width: `${100 * zoom}%`,
                height: `${100 * zoom}%`,
                transform: `scale(${1 / zoom})`,
              }}
            >
              <Background id="storybook-preview-background">{grid ? <Grid /> : null}</Background>
              <IFrame
                id="storybook-preview-iframe"
                title={id || 'preview'}
                src={`iframe.html?path=${location}`}
                allowFullScreen
              />
            </S.Frame>
          </Route>
          {panelList.map((panel, index) => (
            <Route path={panel.route || '/'} startsWith hideOnly key={panel.key || index}>
              {panel.render({ active: true })}
            </Route>
          ))}
        </S.FrameWrap>
      </Fragment>
    );
  }
}
Preview.propTypes = {
  id: PropTypes.string.isRequired,
  toolbar: PropTypes.bool.isRequired,
  channel: PropTypes.shape({
    on: PropTypes.func,
    emit: PropTypes.func,
    removeListener: PropTypes.func,
  }).isRequired,
  location: PropTypes.string.isRequired,
  getElements: PropTypes.func.isRequired,
  options: PropTypes.shape({
    isFullscreen: PropTypes.bool,
  }).isRequired,
  actions: PropTypes.shape({}).isRequired,
};

export { Preview };
