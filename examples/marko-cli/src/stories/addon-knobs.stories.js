import { storiesOf } from '@storybook/marko';
import { withKnobs, boolean, text, number } from '@storybook/addon-knobs';
import { withOptions } from '@storybook/addon-options';
import Hello from '../components/hello/index.marko';
import MarkoWidgetHello from '../components/marko-widgets/hello';
import MarkoWidgetButton from '../components/marko-widgets/button';

storiesOf('Addons|Knobs/Hello', module)
  .addDecorator(withOptions)
  .addDecorator(withKnobs)
  .addParameters({ options: { addonPanelInRight: true } })
  .add('Simple', () => {
    const name = text('Name', 'John Doe');
    const age = number('Age', 44);
    return Hello.renderSync({
      name,
      age,
    });
  });

storiesOf('Addons|Knobs/Hello (Marko Widget)', module)
  .addDecorator(withOptions)
  .addDecorator(withKnobs)
  .addParameters({ options: { addonPanelInRight: false } })
  .add('Simple', () => {
    const name = text('Name', 'John Doe');
    return MarkoWidgetHello.renderSync({
      name,
    });
  });

storiesOf('Addons|Knobs/Button (Marko Widget)', module)
  .addDecorator(withKnobs)
  .add('Simple', () => {
    const body = text('Body', 'Hello Button');
    const priority = text('Priority', 'danger');
    const disabled = boolean('Disabled', false);
    return MarkoWidgetButton.renderSync({
      body,
      priority,
      disabled,
    });
  });
