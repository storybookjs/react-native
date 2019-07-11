import React from 'react';
import { IconItem, IconGallery } from './IconGallery';

import { DocsPageWrapper } from './DocsPage';
import { Icons as ExampleIcon } from '../icon/icon';

export default {
  title: 'Docs|IconGallery',
  Component: IconGallery,
  decorators: [getStory => <DocsPageWrapper>{getStory()}</DocsPageWrapper>],
};

export const defaultStyle = () => (
  <IconGallery>
    <IconItem name="add">
      <ExampleIcon icon="add" />
    </IconItem>
    <IconItem name="subtract">
      <ExampleIcon icon="subtract" />
    </IconItem>
    <IconItem name="home">
      <ExampleIcon icon="home" />
    </IconItem>
    <IconItem name="facehappy">
      <ExampleIcon icon="facehappy" />
    </IconItem>
    <IconItem name="bar">
      <img src="https://placehold.it/50x50" alt="example" />
    </IconItem>
    <IconItem name="bar">
      <img src="https://placehold.it/50x50" alt="example" />
    </IconItem>
  </IconGallery>
);
