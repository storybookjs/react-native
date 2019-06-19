import React, { Fragment } from 'react';

const BadComponent = () => ({ renderable: 'no, react can not render objects' });

export default {
  title: 'Core|Errors',
};

export const exception = () => {
  throw new Error('storyFn threw an error! WHOOPS');
};
exception.title = 'story throws exception';
exception.parameters = {
  storyshots: { disable: true },
  chromatic: { disable: true },
};

export const badComponent = () => (
  <Fragment>
    <div>Hello world</div>
    <BadComponent />
  </Fragment>
);
badComponent.title = 'story errors - variant error';
badComponent.parameters = {
  notes: 'Story does not return something react can render',
  storyshots: { disable: true },
  chromatic: { disable: true },
};

export const badStory = () => false;
badStory.title = 'story errors - story un-renderable type';
badStory.parameters = {
  notes: 'Story does not return something react can render',
  storyshots: { disable: true },
  chromatic: { disable: true },
};
