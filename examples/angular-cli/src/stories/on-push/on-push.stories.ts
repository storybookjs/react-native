import { withKnobs, text, color } from '@storybook/addon-knobs';
import { OnPushBoxComponent } from './on-push-box.component';

export default {
  title: 'Core/OnPush',
  decorators: [withKnobs],
};

export const ClassSpecifiedComponentWithOnPushAndKnobs = () => ({
  component: OnPushBoxComponent,
  props: {
    word: text('Word', 'OnPush'),
    bgColor: color('Box color', '#FFF000'),
  },
});

ClassSpecifiedComponentWithOnPushAndKnobs.story = {
  name: 'Class-specified component with OnPush and Knobs',
  parameters: {
    notes: `
      This component is specified by class and uses OnPush change detection. It has two properties, one being a HostBinding. Both should be updatable using knobs.
    `.trim(),
  },
};
