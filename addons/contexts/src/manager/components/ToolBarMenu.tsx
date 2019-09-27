import React, { ComponentProps } from 'react';
import { Icons, IconButton, WithTooltipPure, TabButton } from '@storybook/components';
import { ToolBarMenuOptions } from './ToolBarMenuOptions';
import { ContextNode, FCNoChildren } from '../../shared/types.d';

type ToolBarMenu = FCNoChildren<{
  icon?: ComponentProps<typeof Icons>['icon'] | '' | void;
  title: ContextNode['title'];
  active: boolean;
  expanded: boolean;
  setExpanded: (state: boolean) => void;
  optionsProps: ComponentProps<typeof ToolBarMenuOptions>;
}>;

export const ToolBarMenu: ToolBarMenu = ({
  icon,
  title,
  active,
  expanded,
  setExpanded,
  optionsProps,
}) => (
  <WithTooltipPure
    closeOnClick
    trigger="click"
    placement="top"
    tooltipShown={expanded}
    onVisibilityChange={setExpanded}
    tooltip={<ToolBarMenuOptions {...optionsProps} />}
  >
    {icon ? (
      <IconButton active={active} title={title}>
        <Icons icon={icon} />
      </IconButton>
    ) : (
      <TabButton active={active}>{title}</TabButton>
    )}
  </WithTooltipPure>
);
