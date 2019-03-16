import React, { Fragment, FunctionComponent } from 'react';
import { Placeholder } from '@storybook/components';

import { Result } from 'axe-core';
import { Item } from './Item';
import { RuleTypes } from '../A11YPanel';

export interface ReportProps {
  items: Result[];
  empty: string;
  passes: boolean;
  type: RuleTypes;
}

export const Report: FunctionComponent<ReportProps> = ({ items, empty, type, passes }) => (
  <Fragment>
    {items.length ? (
      items.map(item => <Item passes={passes} item={item} key={item.id} type={type} />)
    ) : (
      <Placeholder key="placeholder">{empty}</Placeholder>
    )}
  </Fragment>
);