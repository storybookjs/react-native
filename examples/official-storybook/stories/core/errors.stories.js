export default {
  title: 'Core|Errors',
};

// Comment this story out until Chromatic supports skipping stories via parameters (soon I promise!)
// export const exception = () => {
//   throw new Error('error');
// };
// exception.title = 'story throws exception';
// exception.parameters = {
//   storyshots: { disable: true },
// };

export const errors = () => null;
errors.title = 'story errors';
errors.parameters = {
  notes: 'Story does not return something react can render',
  storyshots: { disable: true },
};
