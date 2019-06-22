import { storiesOf } from '@storybook/marko';
import Hello from '../components/hello/index.marko';
import ClickCount from '../components/click-count/index.marko';
import StopWatch from '../components/stop-watch/index.marko';
import Welcome from '../components/welcome/index.marko';

storiesOf('Main|Welcome', module)
  .addParameters({
    component: Welcome,
  })
  .add('welcome', () => Welcome.renderSync({}));

storiesOf('Main|Hello', module)
  .addParameters({
    component: Hello,
  })
  .add('Simple', () => Hello.renderSync({ name: 'abc', age: 20 }))
  .add('with ERROR!', () => 'NOT A MARKO RENDER_RESULT');

storiesOf('Main|ClickCount', module)
  .addParameters({
    component: ClickCount,
  })
  .add('Simple', () => ClickCount.renderSync({}));

storiesOf('Main|StopWatch', module)
  .addParameters({
    component: StopWatch,
  })
  .add('Simple', () => StopWatch.renderSync({}));
