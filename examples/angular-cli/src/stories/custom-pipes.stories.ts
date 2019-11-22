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

export const Simple = () => ({
  component: NameComponent,
  props: {
    field: 'foobar',
  },
});

Simple.story = {
  name: 'Simple',
};

export const WithKnobsStory = () => ({
  component: NameComponent,
  props: {
    field: text('field', 'foobar'),
  },
});

WithKnobsStory.story = {
  name: 'With Knobs',
  decorators: [withKnobs],
};
