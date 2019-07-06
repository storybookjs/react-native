import App from '../../App.vue';

export default {
  title: 'App',

  parameters: {
    component: App,
  },
};

export const app = () => ({
  render: h => h(App),
});
app.story = { name: 'App' };
