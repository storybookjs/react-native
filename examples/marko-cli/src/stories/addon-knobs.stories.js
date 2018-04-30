import { storiesOf } from '@storybook/marko';
import { withKnobs, text, number } from '@storybook/addon-knobs/marko';
import Hello from '../components/hello/index.marko';

storiesOf('Addons|Knobs', module)
  .addDecorator(withKnobs)
  .add('Simple', () => {
    const name = text('Name', 'John Doe');
    const age = number('Age', 44);
    return Hello.renderSync({
      name,
      age,
    });
  });
