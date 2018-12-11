import { window } from 'global';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Events from '@storybook/core-events';
import { types } from '@storybook/addons';
import { Global, css } from '@emotion/core';

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
      <Fragment>
        <Global
          styles={css({
            iframe: {
              border: '0 none',
            },
          })}
        />
        <iframe id={id} title={title} src={src} allowFullScreen={allowFullScreen} {...rest} />
      </Fragment>
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

  shouldComponentUpdate({ componentId, viewMode, options }, { zoom, grid }) {
    const { props, state } = this;

    return (
      options.isFullscreen !== props.options.isFullscreen ||
      options.isToolshown !== props.options.isToolshown ||
      viewMode !== props.viewMode ||
      componentId !== props.componentId ||
      zoom !== state.zoom ||
      grid !== state.grid
    );
  }

  componentDidUpdate(prevProps) {
    const { channel, componentId } = this.props;
    const { path: prevComponentId } = prevProps;
    if (componentId && componentId !== prevComponentId) {
      channel.emit(Events.SET_CURRENT_STORY, { componentId });
    }
  }

  render() {
    const { id, path, location, viewMode, componentId, getElements, actions, options } = this.props;

    const { zoom, grid } = this.state;
    const tools = getElements(types.TOOL);
    const toolList = Object.values(tools);
    const toolbarHeight = options.isToolshown ? 40 : 0;

    const panels = getElements(types.TAB);
    const panelList = Object.values(panels);
    const tabsList = [
      {
        route: () => `/components/${componentId}`,
        match: () => viewMode === 'components',
        title: 'Canvas',
        key: 'canvas',
      },
    ].concat(panelList);

    return (
      <Fragment>
        <Toolbar
          key="toolbar"
          shown={options.isToolshown}
          left={[
            <TabBar key="tabs" scroll={false}>
              {tabsList.map((t, index) => {
                const to = t.route({ componentId, viewMode, path, location });
                const isActive = t.match({ componentId, viewMode, path, location });
                return (
                  <S.UnstyledLink key={t.id || `l${index}`} to={to}>
                    <TabButton active={isActive}>{t.title}</TabButton>
                  </S.UnstyledLink>
                );
              })}
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
            ...toolList.map((t, index) => (
              <Fragment key={t.id || `t${index}`}>{t.render()}</Fragment>
            )),
          ]}
          right={[
            <Separator key="1" />,
            <IconButton key="full" onClick={actions.toggleFullscreen}>
              <Icons icon={options.isFullscreen ? 'cross' : 'expand'} />
            </IconButton>,
            <Separator key="2" />,
            <IconButton key="opener" onClick={() => window.open(`iframe.html?path=${path}`)}>
              <Icons icon="share" />
            </IconButton>,
          ]}
        />
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
                src={`iframe.html?id=${componentId}`}
                allowFullScreen
              />
            </S.Frame>
          </Route>
          {panelList.map(panel => (
            <Fragment key={panel.id}>
              {panel.render({ active: panel.match({ componentId, viewMode, location, path }) })}
            </Fragment>
          ))}
        </S.FrameWrap>
      </Fragment>
    );
  }
}
Preview.propTypes = {
  id: PropTypes.string.isRequired,
  channel: PropTypes.shape({
    on: PropTypes.func,
    emit: PropTypes.func,
    removeListener: PropTypes.func,
  }).isRequired,
  componentId: PropTypes.string,
  path: PropTypes.string,
  viewMode: PropTypes.oneOf(['components', 'info']),
  location: PropTypes.shape({}).isRequired,
  getElements: PropTypes.func.isRequired,
  options: PropTypes.shape({
    isFullscreen: PropTypes.bool,
    isToolshown: PropTypes.bool,
  }).isRequired,
  actions: PropTypes.shape({}).isRequired,
};
Preview.defaultProps = {
  viewMode: undefined,
  componentId: undefined,
  path: undefined,
};

export { Preview };
