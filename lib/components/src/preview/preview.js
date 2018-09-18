import { window } from 'global';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Events from '@storybook/core-events';

import { IconButton, Toolbar, Separator } from './toolbar';
import Icons from '../icons/util/index';
import { Route, Link } from '../router/router';
import { TabButton, TabBar } from '../tabs/tabs';
import { Popout, Item, Icon, Title, Detail, List } from '../menu/menu';

// import Address from './address';
import Zoom from './zoom';
// import Menu from './menu';

const defaults = {
  grid: {
    backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
    backgroundPosition: '-2px -2px, -2px -2px, -1px -1px, -1px -1px',

    backgroundImage: `
    linear-gradient(rgba(0,0,0,0.05) 2px, transparent 2px),
    linear-gradient(90deg, rgba(0,0,0,0.05) 2px, transparent 2px),
    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
  },
  background: {
    backgroundColor: 'transparent',
  },
};

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

const Frame = styled.div(
  {
    position: 'absolute',
    top: 0,
    left: 0,
    border: '0 none',
    transition: 'transform .2s ease-out, height .2s ease-out, width .2s ease-out',
    transformOrigin: 'top left',
    overflow: 'auto',
  },
  ({ grid }) => (grid ? defaults.grid : {}),
  ({ background = defaults.background }) => background,
  {
    '& > iframe': {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
    },
  }
);

const FrameWrap = styled.div(({ offset }) => ({
  position: 'absolute',
  overflow: 'auto',
  left: 0,
  right: 0,
  bottom: 0,
  top: offset,
  zIndex: 3,
  height: offset ? `calc(100% - ${offset}px)` : '100%',
  background: 'transparent',
}));

const UnstyledLink = styled(Link)({
  color: 'inherit',
  textDecoration: 'inherit',
  display: 'inline-block',
});

// eslint-disable-next-line react/no-multi-comp
class Preview extends Component {
  state = {
    zoom: 1,
    grid: false,
  };

  shouldComponentUpdate({ location, toolbar }, { zoom, grid }) {
    const { props, state } = this;

    return (
      location !== props.location ||
      toolbar !== props.toolbar ||
      zoom !== state.zoom ||
      grid !== state.grid
    );
  }

  componentDidUpdate() {
    const { channel, location } = this.props;
    if (location) {
      channel.emit(Events.SET_CURRENT_STORY, { location });
    }
  }

  render() {
    const { id, toolbar = true, location = '/', panels } = this.props;
    const { zoom, grid } = this.state;

    const toolbarHeight = toolbar ? 40 : 0;
    const panelList = Object.entries(panels).map(([key, value]) => ({ ...value, key }));
    const tabsList = panelList.length
      ? [{ route: '/components', title: 'Canvas', key: 'canvas' }].concat(panelList)
      : [];

    return (
      <Fragment>
        {toolbar ? (
          <Toolbar
            key="toolbar"
            left={[
              <TabBar key="tabs" scroll={false}>
                {tabsList.map(t => (
                  <UnstyledLink key={t.key} to={location.replace(/^\/[^/]+/, t.route)}>
                    <TabButton>{t.title}</TabButton>
                  </UnstyledLink>
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
              // <IconButton>
              //        <Icons.Menu />
              //      </IconButton>
              <Popout
                key="menu"
                trigger={props => (
                  <IconButton {...props}>
                    <Icons.Menu />
                  </IconButton>
                )}
              >
                <List>
                  <Item onClick={() => this.setState({ zoom: 1 })}>
                    <Icon type="" />
                    <Title>reset zoom</Title>
                  </Item>
                  <Item onClick={() => this.setState({ grid: !grid })}>
                    <Icon type={grid ? 'Check' : ''} />
                    <Title>toggle grid</Title>
                    <Detail>g</Detail>
                  </Item>
                </List>
              </Popout>,
            ]}
            right={[
              // <Address key="address" url={location} />,
              <IconButton key="opener" onClick={() => window.open(`iframe.html?path=${location}`)}>
                <Icons.NewWindow />
              </IconButton>,
            ]}
          />
        ) : null}
        <FrameWrap offset={toolbarHeight} id="storybook-preview-background">
          <Route path="components" startsWith hideOnly>
            <Frame
              grid={grid}
              style={{
                width: `${100 * zoom}%`,
                height: `${100 * zoom}%`,
                transform: `scale(${1 / zoom})`,
              }}
            >
              <IFrame
                id="storybook-preview-iframe"
                title={id || 'preview'}
                src={`iframe.html?path=${location}`}
                allowFullScreen
              />
            </Frame>
          </Route>
          {Object.values(panels).map(panel => (
            <Route path={panel.route} startsWith hideOnly>
              {panel.render({ active: true })}
            </Route>
          ))}
        </FrameWrap>
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
  panels: PropTypes.shape({}).isRequired,
};

export { Preview };
