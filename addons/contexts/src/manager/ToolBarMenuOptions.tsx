import React from 'react';
import { TooltipLinkList } from '@storybook/components';
import { OPT_OUT } from '../constants';
import { TToolBarMenuOptions } from '../@types';

export const ToolBarMenuOptions: TToolBarMenuOptions = ({ activeName, list, onSelectOption }) => (
  <TooltipLinkList
    links={list.map(name => ({
      key: name,
      id: name,
      title: name !== OPT_OUT ? name : 'Off',
      active: name === activeName,
      onClick: onSelectOption(name),
    }))}
  />
);
