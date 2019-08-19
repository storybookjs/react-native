import React from 'react';
import { DocsPage, DocsWrapper, DocsContent } from './DocsPage';
import * as storyStories from './Story.stories';
import * as previewStories from './Preview.stories';
import * as propsTableStories from './PropsTable/PropsTable.stories';
import * as sourceStories from './Source.stories';
import * as descriptionStories from './Description.stories';

export default {
  title: 'Docs|DocsPage',
  component: DocsPage,
  decorators: [
    storyFn => (
      <DocsWrapper>
        <DocsContent>{storyFn()}</DocsContent>
      </DocsWrapper>
    ),
  ],
};

export const withSubtitle = () => (
  <DocsPage
    title="DocsPage"
    subtitle="What the DocsPage looks like. Meant to be QAed in Canvas tab not in Docs tab."
  >
    {descriptionStories.text()}
    {previewStories.single()}
    {propsTableStories.normal()}
    {sourceStories.jsx()}
  </DocsPage>
);
withSubtitle.story = { name: 'with subtitle' };

export const empty = () => (
  <DocsPage title={null}>
    {storyStories.error()}
    {propsTableStories.error()}
    {sourceStories.sourceUnavailable()}
  </DocsPage>
);

export const noText = () => (
  <DocsPage title="no text">
    {previewStories.single()}
    {propsTableStories.normal()}
    {sourceStories.jsx()}
  </DocsPage>
);
noText.story = { name: 'no text' };

export const text = () => (
  <DocsPage title="Sensorium">
    {descriptionStories.text()}
    {previewStories.single()}
    {propsTableStories.normal()}
    {sourceStories.jsx()}
  </DocsPage>
);

export const markdown = () => (
  <DocsPage title="markdown">
    {descriptionStories.markdown()}
    {previewStories.single()}
    {propsTableStories.normal()}
    {sourceStories.jsx()}
  </DocsPage>
);
