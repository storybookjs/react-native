import React, { Fragment } from 'react';

import { Placeholder } from './placeholder';
import Link from '../typography/link/link';

export default {
  Component: Placeholder,
  title: 'Basics|Placeholder',
};

export const singleChild = () => (
  <Placeholder>This is a placeholder with single child, it's bolded</Placeholder>
);
export const twoChildren = () => (
  <Placeholder>
    <Fragment key="title">This has two children, the first bold</Fragment>
    <Fragment key="desc">
      The second normal weight. Here's a <Link href="https://storybook.js.org">link</Link>
    </Fragment>
  </Placeholder>
);
