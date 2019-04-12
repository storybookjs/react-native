import React, { FunctionComponent } from 'react';
import { storiesOf } from '@storybook/react';
import { styled } from '@storybook/theming';

import { TooltipMessage } from './TooltipMessage';
import { WithToolTipState as WithTooltip } from './WithTooltip';

const ViewPort = styled.div`
  height: 300px;
`;

const BackgroundBox = styled.div`
  width: 500px;
  height: 500px;
  overflow-y: scroll;
  background: #eee;
  position: relative;
`;

const Spacer = styled.div`
  height: 100px;
`;

const Trigger = styled.div`
  width: 200px;
  height: 100px;
  background-color: red;
  color: white;
`;

interface TooltipProps {
  onHide?: () => void;
}

const Tooltip: FunctionComponent<TooltipProps> = ({ onHide }) => (
  <TooltipMessage
    title="Lorem ipsum dolor sit"
    desc="Amet consectatur vestibulum concet durum politu coret weirom"
    links={[{ title: 'Continue', onClick: onHide }]}
  />
);

Tooltip.defaultProps = {
  onHide: null,
};

storiesOf('basics/Tooltip/WithTooltip', module)
  .addDecorator(storyFn => (
    <ViewPort>
      <BackgroundBox>
        <Spacer />
        {storyFn()}
      </BackgroundBox>
    </ViewPort>
  ))
  .add('simple hover', () => (
    <WithTooltip placement="top" trigger="hover" tooltip={<Tooltip />}>
      <Trigger>Hover me!</Trigger>
    </WithTooltip>
  ))
  .add('simple hover, functional', () => (
    <WithTooltip placement="top" trigger="hover" tooltip={Tooltip}>
      <Trigger>Hover me!</Trigger>
    </WithTooltip>
  ))
  .add('simple click', () => (
    <WithTooltip placement="top" trigger="click" tooltip={<Tooltip />}>
      <Trigger>Click me!</Trigger>
    </WithTooltip>
  ))
  .add('simple click start open', () => (
    <WithTooltip placement="top" trigger="click" startOpen tooltip={<Tooltip />}>
      <Trigger>Click me!</Trigger>
    </WithTooltip>
  ))
  .add('simple click closeOnClick', () => (
    <WithTooltip placement="top" trigger="click" closeOnClick tooltip={<Tooltip />}>
      <Trigger>Click me!</Trigger>
    </WithTooltip>
  ))
  .add('no chrome', () => (
    <WithTooltip placement="top" trigger="click" hasChrome={false} tooltip={<Tooltip />}>
      <Trigger>Click me!</Trigger>
    </WithTooltip>
  ));
