import React, { Fragment } from 'react';

const BadComponent = () => ({ renderable: 'no, react can not render objects' });

export default {
  title: 'Core|Errors',
};

export const exception = () => {
  throw new Error('storyFn threw an error! WHOOPS');
};
exception.story = {
  name: 'story throws exception',
  parameters: {
    storyshots: { disable: true },
    chromatic: { disable: true },
  },
};

export const badComponent = () => (
  <Fragment>
    <div>Hello world</div>
    <BadComponent />
  </Fragment>
);
badComponent.story = {
  name: 'story errors - variant error',
  parameters: {
    notes: 'Story does not return something react can render',
    storyshots: { disable: true },
    chromatic: { disable: true },
  },
};

export const badStory = () => false;
badStory.story = {
  name: 'story errors - story un-renderable type',
  parameters: {
    notes: 'Story does not return something react can render',
    storyshots: { disable: true },
    chromatic: { disable: true },
  },
};
