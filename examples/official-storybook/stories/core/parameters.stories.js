import React from 'react';

// We would need to add this in config.js idomatically however that would make this file a bit confusing
import { addParameters } from '@storybook/react';

addParameters({ globalParameter: 'globalParameter' });

export default {
  title: 'Core|Parameters',
  module,
  decorators: [fn => fn({ parameters: { decoratorParameter: 'decoratorParameter' } })],
  parameters: {
    chapterParameter: 'chapterParameter',
  },
};

const removeFileName = ({ fileName, ...rest }) => ({
  ...rest,
});

// I'm not sure what we should recommend regarding propTypes? are they a good idea for examples?
// Given we sort of control the props, should we export a prop type?
export const passed = ({
  // eslint-disable-next-line react/prop-types
  parameters,
}) => <pre>Parameters are {JSON.stringify(removeFileName(parameters), null, 2)}</pre>;
passed.title = 'passed to story';
passed.parameters = { storyParameter: 'storyParameter' };
