import { moduleMetadata } from '@storybook/angular';
import { withKnobs, text } from '@storybook/addon-knobs';

import { DummyService } from './moduleMetadata/dummy.service';
import { ServiceComponent } from './moduleMetadata/service.component';

export default {
  title: 'Custom/Providers',
  decorators: [
    moduleMetadata({
      imports: [],
      schemas: [],
      declarations: [],
      providers: [DummyService],
    }),
  ],
};

export const simple = () => ({
  component: ServiceComponent,
  props: {
    name: 'Static name',
  },
});

simple.story = {
  name: 'Simple',
};

export const withKnobsStory = () => {
  const name = text('name', 'Dynamic knob');

  return {
    component: ServiceComponent,
    props: {
      name,
    },
  };
};

withKnobsStory.story = {
  name: 'With knobs',
  decorators: [withKnobs],
};
