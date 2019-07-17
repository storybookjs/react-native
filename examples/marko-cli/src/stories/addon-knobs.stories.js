import { withKnobs, text, number } from '@storybook/addon-knobs';
import Hello from '../components/hello/index.marko';

export default {
  title: 'Addons|Knobs/Hello',
  decorators: [withKnobs],
  parameters: {
    options: { panelPosition: 'right' },
  },
};

export const Simple = () => ({
  template: Hello,
  input: {
    name: text('Name', 'John Doe'),
    age: number('Age', 44),
  },
});
