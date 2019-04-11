import React from 'react';
import { storiesOf } from '@storybook/react';
import { styled } from '@storybook/theming';
import Tooltip from './Tooltip';

// Popper would position the tooltip absolutely. We just need to make sure we are pos:rel
const mockPopperProps = { style: { position: 'relative', top: '20px', left: '20px' } };

const Content = styled.div({
  width: '100px',
  height: '100px',
  fontSize: '16px',
  textAlign: 'center',
  lineHeight: '100px',
});

storiesOf('basics/Tooltip/Tooltip', module)
  .add('basic, default', () => (
    <Tooltip {...mockPopperProps} color="medium">
      <Content>Text</Content>
    </Tooltip>
  ))
  .add('basic, default, bottom', () => (
    <Tooltip placement="bottom" {...mockPopperProps}>
      <Content>Text</Content>
    </Tooltip>
  ))
  .add('basic, default, left', () => (
    <Tooltip placement="left" {...mockPopperProps}>
      <Content>Text</Content>
    </Tooltip>
  ))
  .add('basic, default, right', () => (
    <Tooltip placement="right" {...mockPopperProps}>
      <Content>Text</Content>
    </Tooltip>
  ))
  .add('no chrome', () => (
    <Tooltip hasChrome={false} {...mockPopperProps}>
      <Content>Text</Content>
    </Tooltip>
  ));
