import { storiesOf } from '@storybook/marko';

import Hello from '../components/hello/index.marko';
import ClickCount from '../components/click-count/index.marko';
import StopWatch from '../components/stop-watch/index.marko';
import Welcome from '../components/welcome/index.marko';

storiesOf('Hello', module)
  .add('with text abc', () => Hello.renderSync({ name: 'abc', age: 20 }))
  .add('with text xyz', () => Hello.renderSync({ name: 'xyz', age: 30 }))
  .add('with No Preview!')
  .add('with ERROR!', () => 'NOT A MARKO RENDER_RESULT');

storiesOf('Watch', module)
  .add('click counter', () => ClickCount.renderSync({}))
  .add('stop watch', () => StopWatch.renderSync({}));

storiesOf('Welcome', module).add('welcome', () => Welcome.renderSync({}));
