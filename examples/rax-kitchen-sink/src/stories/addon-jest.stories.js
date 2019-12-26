import { createElement } from 'rax';
import { withTests } from '@storybook/addon-jest';
import { App } from '../components/App';
// eslint-disable-next-line
import results from '../../jest-test-results.json';

export default {
  title: 'Addon/addon-jest',
  decorators: [withTests({ results })],
};

export const app = () => <App />;
app.story = {
  name: 'App',
  parameters: { jest: ['components/App/App.test.js'] },
};
