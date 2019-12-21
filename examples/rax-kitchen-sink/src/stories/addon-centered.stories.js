import { createElement } from 'rax';
import Centered from '@storybook/addon-centered/rax';
import Text from 'rax-text';
import { App as AppComponent } from '../components/App';

export default {
  title: 'Addon/addon-centered',
  decorators: [Centered],
};

export const Button = () => (
  <button type="button">
    <Text>BUTTON</Text>
  </button>
);

export const App = () => <AppComponent />;
