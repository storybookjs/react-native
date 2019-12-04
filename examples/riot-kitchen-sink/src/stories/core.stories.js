import { tag, mount, addParameters } from '@storybook/riot';

const globalParameter = 'globalParameter';
const chapterParameter = 'chapterParameter';
const storyParameter = 'storyParameter';

tag('parameters', '<div>Parameters are {JSON.stringify (this.opts)}</div>', '', '', () => {});

addParameters({ globalParameter });

export default {
  title: 'Core/Parameters',
  parameters: {
    chapterParameter,
  },
};

export const PassedToStory = ({ parameters: { fileName, ...parameters } }) =>
  mount('parameters', { ...parameters, storyParameter });

PassedToStory.story = {
  name: 'passed to story',
};
