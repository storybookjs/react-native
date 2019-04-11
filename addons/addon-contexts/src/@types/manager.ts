import { Channel } from '@storybook/channels';
import { FunctionComponent, ComponentProps } from 'react';
import { AnyFunctionReturns, StringTuple, StringObject, Omit, ContextNode } from './index';

// helpers
type FCNoChildren<P> = FunctionComponent<{ children?: never } & P>;

// hooks
export type UseChannel = (
  event: string,
  eventHandler: AnyFunctionReturns<void>,
  input?: unknown[]
) => void;

// components
export type TAddonManager = FCNoChildren<{
  channel: Channel;
}>;

export type TToolbarControl = FCNoChildren<
  Omit<
    ContextNode & {
      selected: string;
      setSelected: (...arg: StringTuple) => void;
    },
    'components'
  >
>;

export type TToolBar = FCNoChildren<{
  nodes: ContextNode[];
  state: StringObject;
  setSelected: ComponentProps<TToolbarControl>['setSelected'];
}>;

export type TToolBarMenu = FCNoChildren<{
  icon: string;
  title: string;
  active: boolean;
  expanded: boolean;
  setExpanded: (state: boolean) => void;
  optionsProps: ComponentProps<TToolBarMenuOptions>;
}>;

export type TToolBarMenuOptions = FCNoChildren<{
  activeName: string;
  list: string[];
  onSelectOption: (name: string) => () => void;
}>;
