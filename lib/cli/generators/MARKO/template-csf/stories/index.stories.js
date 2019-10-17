import Welcome from './components/welcome/index.marko';

export default {
  title: 'Welcome',
  component: Welcome,
};

export const welcome = () => ({ component: Welcome });
