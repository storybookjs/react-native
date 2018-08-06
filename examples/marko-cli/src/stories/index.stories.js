import { storiesOf } from '@storybook/marko';
import { withOptions } from '@storybook/addon-options';
import Hello from '../components/hello/index.marko';
import ClickCount from '../components/click-count/index.marko';
import StopWatch from '../components/stop-watch/index.marko';
import Welcome from '../components/welcome/index.marko';

storiesOf('Welcome', module).add('welcome', () => Welcome.renderSync({}));

storiesOf('Hello', module)
  .addDecorator(withOptions)
  .addParameters({ options: { addonPanelInRight: false } })
  .add('Simple', () => Hello.renderSync({ name: 'abc', age: 20 }))
  .add('with ERROR!', () => 'NOT A MARKO RENDER_RESULT');

storiesOf('ClickCount', module)
  .addDecorator(withOptions)
  .addParameters({ options: { addonPanelInRight: true } })
  .add('Simple', () => ClickCount.renderSync({}), { hierarchyRootSeparator: /\|/ });

storiesOf('StopWatch', module)
  .addDecorator(withOptions)
  .addParameters({ options: { addonPanelInRight: false } })
  .add('Simple', () => StopWatch.renderSync({}));
