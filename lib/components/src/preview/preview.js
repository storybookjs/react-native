import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Events from '@storybook/core-events';

import { Toolbar } from './toolbar';
import Address from './address';
import Zoom from './zoom';
import Menu from './menu';

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
    if (location && location.match('/components/')) {
      channel.emit(Events.SET_CURRENT_STORY, { location });
    }
  }

  render() {
    const { id, toolbar = true, location = 'https://example.com' } = this.props;
    const { zoom, grid } = this.state;

    const toolbarHeight = toolbar ? 40 : 0;

    return (
      <Fragment>
        <FrameWrap key="background" offset={toolbarHeight} id="storybook-preview-background">
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
              src={location}
              allowFullScreen
            />
          </Frame>
        </FrameWrap>
        {toolbar ? (
          <Toolbar
            key="toolbar"
            left={[<Address key="address" url={location} />]}
            right={[
              <Zoom key="zoom" current={zoom} set={v => this.setState({ zoom: zoom * v })} />,
              <Menu
                key="menu"
                actions={{
                  'reset zoom': () => this.setState({ zoom: 1 }),
                  'toggle grid': () => this.setState({ grid: !grid }),
                }}
              />,
            ]}
          />
        ) : null}
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
};

export { Preview };
