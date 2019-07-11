import { createElement } from 'rax';
import Centered from '@storybook/addon-centered/rax';
import Button from 'rax-button';
import Text from 'rax-text';
import App from '../components/App';

export default {
  title: 'Addon|addon-centered',
  decorators: [Centered],
};

export const button = () => (
  <Button>
    <Text>BUTTON</Text>
  </Button>
);
button.story = { name: 'Button' };

export const app = () => <App />;
app.story = { name: 'App' };
