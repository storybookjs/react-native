import { createElement } from 'rax';
import { storiesOf } from '@storybook/rax';
import { withTests } from '@storybook/addon-jest';
import App from '../components/App';
import Welcome from '../components/Welcome';
// eslint-disable-next-line import/no-unresolved
import results from '../../jest-test-results.json';

storiesOf('Addon|addon-jest', module)
  .addDecorator(withTests({ results }))
  .add('App', () => <App />, { jest: ['components/App/App.test.js'] })
  .add('Welcome', () => <Welcome />, { jest: ['components/Welcome/Welcome.test.js'] });
