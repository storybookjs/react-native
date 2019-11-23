import Welcome from '../components/welcome/index.marko';

export default {
  title: 'Main/Welcome',
  parameters: {
    component: Welcome,
  },
};

export const welcome = () => ({ component: Welcome });
