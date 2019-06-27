export default {
  title: 'Addons|Backgrounds',
  parameters: {
    backgrounds: [
      { name: 'light', value: '#eeeeee' },
      { name: 'dark', value: '#222222', default: true },
    ],
  },
};

export const story1 = () =>
  '<span style="color: white">You should be able to switch backgrounds for this story</span>';
story1.story = { name: 'story 1' };

export const story2 = () => '<span style="color: white">This one too!</span>';
story2.story = { name: 'story 2' };
