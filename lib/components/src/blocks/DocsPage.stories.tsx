import React from 'react';
import { Title, Subtitle, DocsWrapper, DocsContent } from './DocsPage';
import * as storyStories from './Story.stories';
import * as previewStories from './Preview.stories';
import * as propsTableStories from './PropsTable/PropsTable.stories';
import * as sourceStories from './Source.stories';
import * as descriptionStories from './Description.stories';

export default {
  title: 'Docs/DocsPage',
  component: DocsWrapper,
  decorators: [
    storyFn => (
      <DocsWrapper>
        <DocsContent>{storyFn()}</DocsContent>
      </DocsWrapper>
    ),
  ],
};

export const withSubtitle = () => (
  <>
    <Title>DocsPage</Title>
    <Subtitle>
      What the DocsPage looks like. Meant to be QAed in Canvas tab not in Docs tab.
    </Subtitle>
    {descriptionStories.text()}
    {previewStories.single()}
    {propsTableStories.normal()}
    {sourceStories.jsx()}
  </>
);
withSubtitle.story = { name: 'with subtitle' };

export const empty = () => (
  <>
    {storyStories.error()}
    {propsTableStories.error()}
    {sourceStories.sourceUnavailable()}
  </>
);

export const noText = () => (
  <>
    <Title>no text</Title>
    {previewStories.single()}
    {propsTableStories.normal()}
    {sourceStories.jsx()}
  </>
);
noText.story = { name: 'no text' };

export const text = () => (
  <>
    <Title>Sensorium</Title>
    {descriptionStories.text()}
    {previewStories.single()}
    {propsTableStories.normal()}
    {sourceStories.jsx()}
  </>
);

export const markdown = () => (
  <>
    <Title>markdown</Title>
    {descriptionStories.markdown()}
    {previewStories.single()}
    {propsTableStories.normal()}
    {sourceStories.jsx()}
  </>
);
