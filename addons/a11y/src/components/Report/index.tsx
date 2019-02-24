import React, { Fragment, FunctionComponent } from 'react';
import { Placeholder } from '@storybook/components';

import Item from './Item';
import { Result } from 'axe-core';

export interface ReportProps {
  items: Result[];
  empty: string;
  passes: boolean;
}

const Report: FunctionComponent<ReportProps> = ({ items, empty, passes }) => (
  <Fragment>
    {items.length ? (
      items.map((item) => <Item passes={passes} item={item} key={item.id} />)
    ) : (
      <Placeholder key="placeholder">{empty}</Placeholder>
    )}
  </Fragment>
);

export default Report;
