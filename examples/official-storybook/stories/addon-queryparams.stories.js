import { document } from 'global';
import React from 'react';
import { withQuery } from '@storybook/addon-queryparams';

export default {
  title: 'Addons/QueryParams',
  decorators: [withQuery],

  parameters: {
    query: {
      mock: true,
    },
  },
};

export const MockIsTrue = () => (
  <div>This story should have an extra url query param: {document.location.search}</div>
);

MockIsTrue.story = {
  name: 'mock is true',
};

export const MockIs4 = () => (
  <div>This story should have an extra url query param: {document.location.search}</div>
);

MockIs4.story = {
  name: 'mock is 4',
  parameters: { query: { mock: 4 } },
};
