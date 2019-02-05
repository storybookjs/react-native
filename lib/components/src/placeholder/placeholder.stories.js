import React, { Fragment } from 'react';

import { Placeholder } from './placeholder';

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
      The second normal weight. Here's a <a href="https://storybook.js.org">link</a>
    </Fragment>
  </Placeholder>
);
