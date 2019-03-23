import React, { Fragment, FunctionComponent } from 'react';
import { Placeholder } from '@storybook/components';
import { styled } from '@storybook/theming';
import { Result, NodeResult } from 'axe-core';
import { Item } from './Item';
import { RuleType } from '../A11YPanel';
import HighlightToggle from './HighlightToggle';

export interface ReportProps {
  items: Result[];
  empty: string;
  passes: boolean;
  type: RuleType;
}

export const Report: FunctionComponent<ReportProps> = ({ items, empty, type, passes }) => (
  <Fragment>
    {items && items.length ? (
      items.map(item => <Item passes={passes} item={item} key={`${type}:${item.id}`} type={type} />)
    ) : (
      <Placeholder key="placeholder">{empty}</Placeholder>
    )}
  </Fragment>
);
