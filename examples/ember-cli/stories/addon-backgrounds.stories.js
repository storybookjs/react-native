import hbs from 'htmlbars-inline-precompile';

export default {
  title: 'Addon|Backgrounds',

  parameters: {
    backgrounds: [
      { name: 'light', value: '#eeeeee' },
      { name: 'dark', value: '#222222', default: true },
    ],
  },
};

export const story1 = () => ({
  template: hbs`<button>You should be able to switch backgrounds for this story</button>`,
});

story1.story = {
  name: 'story 1',
};

export const story2 = () => ({
  template: hbs`<button>This one too!</button>`,
});

story2.story = {
  name: 'story 2',
};
