import React from 'react';

// We would need to add this in config.js idomatically however that would make this file a bit confusing
import { addParameters } from '@storybook/react';

addParameters({ globalParameter: 'globalParameter' });

export default {
  title: 'Core|Parameters',
  decorators: [fn => fn({ parameters: { decoratorParameter: 'decoratorParameter' } })],
  parameters: {
    chapterParameter: 'chapterParameter',
  },
};

// I'm not sure what we should recommend regarding propTypes? are they a good idea for examples?
// Given we sort of control the props, should we export a prop type?
export const passed = ({
  // eslint-disable-next-line react/prop-types
  parameters: { options, ...parameters },
}) => <pre>Parameters are {JSON.stringify(parameters, null, 2)}</pre>;
passed.title = 'passed to story';
passed.parameters = { storyParameter: 'storyParameter' };
