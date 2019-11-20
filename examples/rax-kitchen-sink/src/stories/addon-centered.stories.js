import { createElement } from 'rax';
import Centered from '@storybook/addon-centered/rax';
import Text from 'rax-text';
import App from '../components/App';

export default {
  title: 'Addon/addon-centered',
  decorators: [Centered],
};

export const Button = () => (
  <Button type="button">
    <Text>BUTTON</Text>
  </Button>
);
Button.story = { name: 'Button' };

export const app = () => <App />;
app.story = { name: 'App' };
