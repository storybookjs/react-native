import { ButtonComponent } from './doc-button.component';

export default {
  title: 'DocButton',
  component: ButtonComponent,
};

export const basic = () => ({
  component: ButtonComponent,
  props: {
    label: 'Test labels',
  },
});
