import React, { ComponentProps } from 'react';
import { Icons, IconButton, WithTooltip } from '@storybook/components';
import { ToolBarMenuOptions } from './ToolBarMenuOptions';
import { ContextNode, FCNoChildren } from '../types';

type ToolBarMenu = FCNoChildren<{
  icon: ContextNode['icon'];
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
}) =>
  icon ? (
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
  ) : null;
