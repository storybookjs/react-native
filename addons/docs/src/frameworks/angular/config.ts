/* eslint-disable import/no-extraneous-dependencies */
import { addParameters } from '@storybook/client-api';
import { extractProps, extractComponentDescription } from './compodoc';

addParameters({
  docs: {
    extractProps,
    extractComponentDescription,
  },
});
