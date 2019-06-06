import { createElement } from 'rax';
import { storiesOf } from '@storybook/rax';
import { linkTo } from '@storybook/addon-links';
import App from '../components/App';
import Welcome from '../components/Welcome';

storiesOf('Basic', module)
  .add('Welcome screen', () => <Welcome showApp={linkTo('Addon|addon-actions', 'with text')} />)
  .add('App', () => <App />);
