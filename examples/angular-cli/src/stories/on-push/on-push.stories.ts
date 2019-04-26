import { storiesOf } from '@storybook/angular';
import { withKnobs, text, color } from '@storybook/addon-knobs';
import { OnPushBoxComponent } from './on-push-box.component';

storiesOf('Core|OnPush', module)
  .addDecorator(withKnobs)
  .add(
    'Class-specified component with OnPush and Knobs',
    () => ({
      component: OnPushBoxComponent,
      props: {
        word: text('Word', 'OnPush'),
        bgColor: color('Box color', '#FFF000'),
      },
    }),
    {
      notes: `
        This component is specified by class and uses OnPush change detection. It has two properties, one being a HostBinding. Both should be updatable using knobs.
      `.trim(),
    }
  );
