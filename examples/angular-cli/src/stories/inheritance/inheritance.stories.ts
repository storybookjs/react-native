import { IconButtonComponent } from './icon-button.component';
import { BaseButtonComponent } from './base-button.component';

export default {
  title: 'Custom/Inheritance',
};

export const iconButton = () => ({
  component: IconButtonComponent,
  props: {
    icon: 'this is icon',
    label: 'this is label',
  },
});

iconButton.story = {
  name: 'icon button',
};

export const baseButton = () => ({
  component: BaseButtonComponent,
  props: {
    label: 'this is label',
  },
});

baseButton.story = {
  name: 'base button',
};
