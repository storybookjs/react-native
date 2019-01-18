export default {
  title: 'Core|Errors',
};

export const exception = () => {
  throw new Error('error');
};
exception.title = 'story throws exception';
exception.parameters = {
  storyshots: { disable: true },
  chromatic: { disable: true },
};

export const errors = () => null;
errors.title = 'story errors';
errors.parameters = {
  notes: 'Story does not return something react can render',
  storyshots: { disable: true },
};
