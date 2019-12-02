import { ButtonComponent } from './doc-button.component';

export default {
  title: 'DocButton',
  component: ButtonComponent,
  parameters: { docs: { iframeHeight: 120 } },
};

export const Basic = () => ({
  component: ButtonComponent,
  props: {
    label: 'Docs Test',
  },
});
