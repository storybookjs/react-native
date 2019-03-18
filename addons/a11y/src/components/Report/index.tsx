import React, { Fragment, FunctionComponent } from 'react';
import { Placeholder } from '@storybook/components';

import { Result } from 'axe-core';
import { Item } from './Item';

export interface ReportProps {
  items: Result[];
  empty: string;
  passes: boolean;
  name: string;
}

export const Report: FunctionComponent<ReportProps> = ({ items, empty, passes, name }) => (
  <Fragment>
    {items.length ? (
      items.map(item => <Item passes={passes} item={item} key={`${name}:${item.id}`} />)
    ) : (
      <Placeholder key="placeholder">{empty}</Placeholder>
    )}
  </Fragment>
);
