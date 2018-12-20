import React from 'react';

// We would need to add this in config.js idomatically however that would make this file a bit confusing
import { addParameters } from '@storybook/react';

const globalParameter = 'globalParameter';
const chapterParameter = 'chapterParameter';
const decoratorParameter = 'decoratorParameter';
const storyParameter = 'storyParameter';

addParameters({ globalParameter });

export default {
  title: 'Core|Parameters',
  decorators: [fn => fn({ decoratorParameter })],
  parameters: {
    chapterParameter,
  },
};

// I'm not sure what we should recommend regarding propTypes? are they a good idea for examples?
// Given we sort of control the props, should we export a prop type?
// eslint-disable-next-line react/prop-types
export const passed = ({ parameters: { fileName, ...parameters } }) => (
  <div>Parameters are {JSON.stringify(parameters)}</div>
);
passed.title = 'passed to story';
passed.parameters = { storyParameter };
