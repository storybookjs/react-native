export default {
  title: 'Core|Errors',
};

export const exception = () => {
  throw new Error('error');
};
exception.story = {
  name: 'story throws exception',
  parameters: {
    storyshots: { disable: true },
    chromatic: { disable: true },
  },
};

export const errors = () => null;
errors.story = {
  name: 'story errors',
  parameters: {
    notes: 'Story does not return something react can render',
    storyshots: { disable: true },
  },
};
