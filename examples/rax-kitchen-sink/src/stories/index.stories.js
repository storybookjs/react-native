import { createElement } from 'rax';
import { linkTo } from '@storybook/addon-links';
import App from '../components/App';
import Welcome from '../components/Welcome';

export default {
  title: 'Basic',
};

export const WelcomeScreen = () => <Welcome showApp={linkTo('Addon|addon-actions', 'with text')} />;
WelcomeScreen.story = {
  name: 'Welcome screen',
};

export const app = () => <App />;
app.story = {
  name: 'App',
};
