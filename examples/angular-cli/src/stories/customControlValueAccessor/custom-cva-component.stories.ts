import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { withNotes } from '@storybook/addon-notes';
import { CustomCvaComponent } from './custom-cva.component';

const description = `
  This is an example of component that implements ControlValueAccessor interface
`;

storiesOf('ngModel', module).add(
  'custom ControlValueAccessor',
  withNotes(description)(() => ({
    component: CustomCvaComponent,
    props: {
      ngModel: 'Type anything',
      ngModelChange: action('ngModelChnange'),
    },
  }))
);
