import React from 'react';

import Placeholder from './placeholder';

export default {
  Component: Placeholder,
  title: 'Basics|Placeholder',
};

export const titleOnly = () => <Placeholder title="This is a placeholder with title" />;
export const titleAndDesc = () => (
  <Placeholder title="This is a title">
    This is a desc <a href="https://storybook.js.org">link</a>
  </Placeholder>
);
export const descOnly = () => (
  <Placeholder>
    This is a desc only <a href="https://storybook.js.org">link</a>
  </Placeholder>
);
