export default {
  title: 'Core/Errors',
};

export const ThrowsError = () => {
  throw new Error('foo');
};
ThrowsError.story = { parameters: { storyshots: { disable: true } } };

export const NullError = () => null;
