import React, { Fragment } from 'react';

const badOutput = { renderable: 'no, react can not render objects' };
const BadComponent = () => badOutput;

export default {
  title: 'Core/Errors',
};

export const Exception = () => {
  throw new Error('storyFn threw an error! WHOOPS');
};
Exception.story = {
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
  name: 'story errors - invariant error',
  parameters: {
    notes: 'Story does not return something react can render',
    storyshots: { disable: true },
    chromatic: { disable: true },
  },
};

export const BadStory = () => badOutput;
BadStory.story = {
  name: 'story errors - story un-renderable type',
  parameters: {
    notes: 'Story does not return something react can render',
    storyshots: { disable: true },
    chromatic: { disable: true },
  },
};
