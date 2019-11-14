import ClickCount from '../components/click-count/index.marko';

export default {
  title: 'Main/ClickCount',
  parameters: {
    component: ClickCount,
  },
};

export const Simple = () => ({ component: ClickCount });
