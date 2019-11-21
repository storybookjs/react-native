import hbs from 'htmlbars-inline-precompile';

export default {
  title: 'Welcome',

  parameters: {
    options: { showPanel: false },
  },
};

export const Basic = () => ({
  template: hbs`
        {{welcome-page}}
      `,
});
