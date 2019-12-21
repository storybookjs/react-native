import { action } from '@storybook/addon-actions';
import { CustomCvaComponent } from './custom-cva.component';

const description = `
  This is an example of component that implements ControlValueAccessor interface
`;

export default {
  title: 'Custom/ngModel',
};

export const CustomControlValueAccessor = () => ({
  component: CustomCvaComponent,
  props: {
    ngModel: 'Type anything',
    ngModelChange: action('ngModelChnange'),
  },
});

CustomControlValueAccessor.story = {
  name: 'custom ControlValueAccessor',
  parameters: { notes: description },
};
