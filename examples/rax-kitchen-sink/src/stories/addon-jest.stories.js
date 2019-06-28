import { createElement } from 'rax';
import { withTests } from '@storybook/addon-jest';
import App from '../components/App';
import Welcome from '../components/Welcome';
// eslint-disable-next-line import/no-unresolved
import results from '../../jest-test-results.json';

export default {
  title: 'Addon|addon-jest',
  decorators: [withTests({ results })],
};

export const app = () => <App />;
app.story = {
  name: 'App',
  parameters: { jest: ['components/App/App.test.js'] },
};

export const welcome = () => <Welcome />;
welcome.story = {
  name: 'Welcome',
  parameters: { jest: ['components/Welcome/Welcome.test.js'] },
};
