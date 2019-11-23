import React from 'react';
import { withTests as withTestsHOC } from '@storybook/addon-jest';

import results from './addon-jest.testresults.json';

export default {
  title: 'Addons/Jest',
  decorators: [withTestsHOC({ results })],
};

export const WithTests = () => <p>Hello</p>;
WithTests.story = {
  parameters: { jest: 'addon-jest' },
};
