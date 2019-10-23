import { withKnobs, text } from '@storybook/addon-knobs';
import { DiComponent } from './di.component';

export default {
  title: 'Custom|Dependencies',
};

export const inputsAndInjectDependencies = () => ({
  component: DiComponent,
  props: {
    title: 'Component dependencies',
  },
});

inputsAndInjectDependencies.story = {
  name: 'inputs and inject dependencies',
};

export const inputsAndInjectDependenciesWithKnobs = () => ({
  component: DiComponent,
  props: {
    title: text('title', 'Component dependencies'),
  },
});

inputsAndInjectDependenciesWithKnobs.story = {
  name: 'inputs and inject dependencies with knobs',
  decorators: [withKnobs],
};
