import { withKnobs, text, number } from '@storybook/addon-knobs';
import Hello from '../components/hello/index.marko';

export default {
  title: 'Addons|Knobs/Hello',
  decorators: [withKnobs],
  parameters: {
    component: Hello,
    options: { panelPosition: 'right' },
  },
};

export const Simple = () => {
  const name = text('Name', 'John Doe');
  const age = number('Age', 44);
  return Hello.renderSync({
    name,
    age,
  });
};
