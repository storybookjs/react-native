import { createElement } from 'rax';
import { storiesOf } from '@storybook/rax';
import Button from 'rax-button';
import Text from 'rax-text';
import App from '../components/App';

storiesOf('Basic', module)
  .add('Button', () => (
    <Button>
      <Text>BUTTON</Text>
    </Button>
  ))
  .add('App', () => <App />);
