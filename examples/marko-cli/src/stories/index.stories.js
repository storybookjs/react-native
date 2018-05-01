import { storiesOf } from '@storybook/marko';

import Hello from '../components/hello/index.marko';
import ClickCount from '../components/click-count/index.marko';
import StopWatch from '../components/stop-watch/index.marko';
import Welcome from '../components/welcome/index.marko';

storiesOf('Welcome', module).add('welcome', () => Welcome.renderSync({}));

storiesOf('Hello', module)
  .add('Simple', () => Hello.renderSync({ name: 'abc', age: 20 }))
  .add('with No Preview!')
  .add('with ERROR!', () => 'NOT A MARKO RENDER_RESULT');

storiesOf('ClickCount', module).add('Simple', () => ClickCount.renderSync({}));

storiesOf('StopWatch', module).add('Simple', () => StopWatch.renderSync({}));
