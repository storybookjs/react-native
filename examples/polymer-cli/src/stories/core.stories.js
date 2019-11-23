import { addParameters } from '@storybook/polymer';

const globalParameter = 'globalParameter';
const chapterParameter = 'chapterParameter';
const storyParameter = 'storyParameter';

addParameters({ globalParameter });

export default {
  title: 'Core/Parameters',

  parameters: {
    chapterParameter,
  },
};

export const PassedToStory = ({ parameters: { fileName, ...parameters } }) =>
  `<div>Parameters are ${JSON.stringify(parameters)}</div>`;

PassedToStory.story = {
  name: 'passed to story',

  parameters: {
    storyParameter,
  },
};
