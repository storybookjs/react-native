import { addParameters } from '@storybook/angular';
import { Button } from '@storybook/angular/demo';

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

export const PassedToStory = ({ parameters: { fileName, ...parameters } }) => ({
  component: Button,
  props: {
    text: `Parameters are ${JSON.stringify(parameters)}`,
    onClick: () => 0,
  },
});

PassedToStory.story = {
  name: 'passed to story',
  parameters: { storyParameter },
};
