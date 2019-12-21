import { createElement } from 'rax';
import { linkTo } from '@storybook/addon-links';
import { App as AppComponent } from '../components/App/index';
import { Welcome } from '../components/Welcome/index';

export default {
  title: 'Basic',
};

export const WelcomeScreen = () => <Welcome showApp={linkTo('Addon|addon-actions', 'with text')} />;
export const App = () => <AppComponent />;
