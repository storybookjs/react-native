import { moduleMetadata } from '@storybook/angular';
import { withKnobs, text } from '@storybook/addon-knobs';

import { NameComponent } from './moduleMetadata/name.component';
import { CustomPipePipe } from './moduleMetadata/custom.pipe';

export default {
  title: 'Custom/Pipes',
  decorators: [
    moduleMetadata({
      imports: [],
      schemas: [],
      declarations: [CustomPipePipe],
      providers: [],
    }),
  ],
};

export const simple = () => ({
  component: NameComponent,
  props: {
    field: 'foobar',
  },
});

simple.story = {
  name: 'Simple',
};

export const withKnobsStory = () => ({
  component: NameComponent,
  props: {
    field: text('field', 'foobar'),
  },
});

withKnobsStory.story = {
  name: 'With Knobs',
  decorators: [withKnobs],
};
