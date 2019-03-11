import React, { Fragment, FunctionComponent } from 'react';
import { Placeholder } from '@storybook/components';

import { Result } from 'axe-core';
import { Item } from './Item';

export interface ReportProps {
  items: Result[];
  empty: string;
  passes: boolean;
}

export const Report: FunctionComponent<ReportProps> = ({ items, empty, passes }) => (
  <Fragment>
    {items.length ? (
      items.map(item => <Item passes={passes} item={item} key={item.id} />)
    ) : (
      <Placeholder key="placeholder">{empty}</Placeholder>
    )}
  </Fragment>
);
