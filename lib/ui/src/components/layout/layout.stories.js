import React from 'react';
import { storiesOf } from '@storybook/react';
import styled from '@emotion/styled';
import { Desktop } from './desktop';
import { Mobile } from './mobile';

const PlaceholderBlock = styled.div(({ color }) => ({
  background: color || 'hotpink',
  position: 'absolute',
  top: 0,
  rigth: 0,
  bottom: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Nav = props => (
  <PlaceholderBlock color="hotpink">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderBlock>
);
const Preview = props => (
  <PlaceholderBlock color="deepskyblue">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderBlock>
);
const Panel = props => (
  <PlaceholderBlock color="orangered">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </PlaceholderBlock>
);

const props = {
  Nav,
  Preview,
  Panel,
  options: { isFullscreen: false, showNav: true, showPanel: true, panelPosition: 'right' },
};

storiesOf('UI|Desktop layout', module)
  .add('default', () => <Desktop {...props} />)
  .add('no Nav', () => <Desktop {...props} options={{ ...props.options, showNav: false }} />)
  .add('no Panel', () => <Desktop {...props} options={{ ...props.options, showPanel: false }} />)
  .add('bottom Panel', () => (
    <Desktop {...props} options={{ ...props.options, panelPosition: 'bottom' }} />
  ))
  .add('full', () => <Desktop {...props} options={{ ...props.options, isFullscreen: true }} />);

storiesOf('UI|Mobile layout', module)
  .add('initial 0', () => <Mobile {...props} options={{ initialActive: 0 }} />)
  .add('initial 1', () => <Mobile {...props} options={{ initialActive: 1 }} />)
  .add('initial 2', () => <Mobile {...props} options={{ initialActive: 2 }} />);
