import hbs from 'htmlbars-inline-precompile';

export default {
  title: 'Welcome',

  parameters: {
    options: { showPanel: false },
  },
};

export const basic = () => ({
  template: hbs`
        {{welcome-page}}
      `,
});
