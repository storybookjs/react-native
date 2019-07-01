import { createElement } from 'rax';
import { linkTo } from '@storybook/addon-links';
import App from '../components/App';
import Welcome from '../components/Welcome';

export default {
  title: 'Basic',
};

export const welcomeScreen = () => <Welcome showApp={linkTo('Addon|addon-actions', 'with text')} />;
welcomeScreen.story = {
  name: 'Welcome screen',
};

export const app = () => <App />;
app.story = {
  name: 'App',
};
