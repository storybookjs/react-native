import { createElement } from 'rax';
import Centered from '@storybook/addon-centered/rax';
import { storiesOf } from '@storybook/rax';
import Button from 'rax-button';
import Text from 'rax-text';
import App from '../components/App';

storiesOf('Addon|addon-centered', module)
  .addDecorator(Centered)
  .add('Button', () => (
    <Button>
      <Text>BUTTON</Text>
    </Button>
  ))
  .add('App', () => <App />);
