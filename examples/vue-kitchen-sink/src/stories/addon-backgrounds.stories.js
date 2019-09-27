export default {
  title: 'Addon|Backgrounds',
  parameters: {
    backgrounds: [
      { name: 'light', value: '#eeeeee' },
      { name: 'dark', value: '#222222', default: true },
    ],
  },
};

export const story1 = () => {
  const content = 'You should be able to switch backgrounds for this story';

  return {
    template: `<button>${content}</button>`,
  };
};

story1.story = {
  name: 'story 1',
};

export const story2 = () => {
  const content = 'This one too!';

  return {
    template: `<button>${content}</button>`,
  };
};

story2.story = {
  name: 'story 2',
};
