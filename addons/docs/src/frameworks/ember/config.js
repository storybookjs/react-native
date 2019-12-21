/* eslint-disable import/no-extraneous-dependencies */
import { addParameters } from '@storybook/client-api';
import { extractProps, extractComponentDescription } from './jsondoc';

addParameters({
  docs: {
    iframeHeight: 80,
    extractProps,
    extractComponentDescription,
  },
});
