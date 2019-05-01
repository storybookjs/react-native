import React, { ComponentProps } from 'react';
import { Icons, IconButton, WithTooltip } from '@storybook/components';
import { ToolBarMenuOptions } from './ToolBarMenuOptions';
import { ContextNode, FCNoChildren } from '../../shared/types.d';

type ToolBarMenu = FCNoChildren<{
  icon: ComponentProps<typeof Icons>['icon'];
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
  <WithTooltip
    closeOnClick
    trigger="click"
    placement="top"
    tooltipShown={expanded}
    onVisibilityChange={setExpanded}
    tooltip={<ToolBarMenuOptions {...optionsProps} />}
  >
    <IconButton active={active} title={title}>
      <Icons icon={icon} />
    </IconButton>
  </WithTooltip>
);
