/* eslint-disable import/no-extraneous-dependencies */
import { addParameters } from '@storybook/client-api';
import { extractProps, extractComponentDescription } from './jsondoc';

addParameters({
  docs: {
    iframeHeight: 60,
    extractProps,
    extractComponentDescription,
  },
});
