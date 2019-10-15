export default {
  title: 'Core|Errors',
};

export const throwsError = () => {
  throw new Error('foo');
};
throwsError.story = { parameters: { storyshots: { disable: true } } };

export const nullError = () => null;
