import { storiesOf } from '@storybook/marko';
import { withKnobs, text, number } from '@storybook/addon-knobs';
import { withOptions } from '@storybook/addon-options';
import Hello from '../components/hello/index.marko';

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
