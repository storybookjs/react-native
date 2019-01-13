import { setInterval } from 'global';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import styled from '@emotion/styled';

import { Desktop } from './desktop';
import { Mobile } from './mobile';

const PlaceholderBlock = styled.div(({ color }) => ({
  background: color || 'hotpink',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
}));

class PlaceholderClock extends Component {
  state = {
    count: 1,
  };

  componentDidMount() {
    this.interval = setInterval(() => {
      const { count } = this.state;
      this.setState({ count: count + 1 });
    }, 1000);
  }

  componentWillUnmount() {
    const { interval } = this;
    clearInterval(interval);
  }

  render() {
    const { children, color } = this.props;
    const { count } = this.state;

    return (
      <PlaceholderBlock color={color}>
        <h2
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            color: 'rgba(0,0,0,0.2)',
            fontSize: '150px',
            lineHeight: '150px',
            margin: '-20px',
          }}
        >
          {count}
        </h2>
        {children}
      </PlaceholderBlock>
    );
  }
}
PlaceholderClock.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
};

const Nav = props => (
  <PlaceholderClock color="hotpink">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderClock>
);
const Preview = props => (
  <PlaceholderClock color="deepskyblue">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderClock>
);
const Panel = props => (
  <PlaceholderClock color="orangered">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderClock>
);
const Page = props => (
  <PlaceholderClock color="cyan">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderClock>
);

const props = {
  Nav,
  Preview,
  Panel,
  pages: [],
  options: { isFullscreen: false, showNav: true, showPanel: true, panelPosition: 'right' },
  location: new URL('http://localhost:9011/?path=/components/UI-DesktopLayout-noNav'),
  path: '/components/UI-DesktopLayout-noNav',
  viewMode: 'components',
  storyId: 'UI-DesktopLayout-noNav',
};

storiesOf('UI|Desktop layout', module)
  .add('default', () => <Desktop {...props} />)
  .add('no Nav', () => <Desktop {...props} options={{ ...props.options, showNav: false }} />)
  .add('no Panel', () => <Desktop {...props} options={{ ...props.options, showPanel: false }} />)
  .add('bottom Panel', () => (
    <Desktop {...props} options={{ ...props.options, panelPosition: 'bottom' }} />
  ))
  .add('full', () => <Desktop {...props} options={{ ...props.options, isFullscreen: true }} />)
  .add('no Panel, no Nav', () => (
    <Desktop {...props} options={{ ...props.options, showPanel: false, showNav: false }} />
  ))
  .add('page', () => (
    <Desktop
      {...props}
      pages={[
        {
          key: 'settings',
          // eslint-disable-next-line react/prop-types
          route: ({ children }) => <Fragment>{children}</Fragment>,
          render: () => <Page />,
        },
      ]}
      viewMode={undefined}
    />
  ));

storiesOf('UI|Mobile layout', module)
  .add('initial 0', () => <Mobile {...props} options={{ initialActive: 0 }} />)
  .add('initial 1', () => <Mobile {...props} options={{ initialActive: 1 }} />)
  .add('initial 2', () => <Mobile {...props} options={{ initialActive: 2 }} />)
  .add('page', () => (
    <Mobile
      {...props}
      options={{ initialActive: 1 }}
      pages={[
        {
          key: 'settings',
          // eslint-disable-next-line react/prop-types
          route: ({ children }) => <Fragment>{children}</Fragment>,
          render: () => <Page />,
        },
      ]}
      viewMode={undefined}
    />
  ));
