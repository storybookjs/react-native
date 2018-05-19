import { storiesOf } from '@storybook/marko';

import { withKnobs, text } from '@storybook/addon-knobs';
import Welcome from './components/welcome/index.marko';
import MarkoWidgetHello from './components/hello/index.marko';

storiesOf('Welcome', module).add('welcome', () => Welcome.renderSync({}));

storiesOf('Hello (Marko Widget)', module)
  .addDecorator(withKnobs)
  .add('Simple', () => {
    const name = text('Name', 'John Doe');
    return MarkoWidgetHello.renderSync({
      name,
    });
  });
