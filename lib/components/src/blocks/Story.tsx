import React from 'react';

import { IFrame } from './IFrame';
import { EmptyBlock } from './EmptyBlock';

const BASE_URL = 'iframe.html';

export enum StoryError {
  NO_STORY = 'No component or story to display',
}

interface InlineStoryProps {
  title: string;
  height?: string;
  storyFn: () => React.ElementType;
}

interface IFrameStoryProps {
  title: string;
  height?: string;
  id: string;
}

// How do you XOR properties in typescript?
export interface StoryProps {
  inline: boolean;
  title: string;
  height?: string;
  id?: string;
  storyFn?: () => React.ElementType;
  error?: StoryError;
}

const InlineStory: React.FunctionComponent<InlineStoryProps> = ({ storyFn, height }) => (
  <div style={{ height }}>{storyFn()}</div>
);

const IFrameStory: React.FunctionComponent<IFrameStoryProps> = ({
  id,
  title,
  height = '500px',
}) => (
  <div style={{ width: '100%', height }}>
    <IFrame
      key="iframe"
      id={`storybook-Story-${id}`}
      title={title}
      src={`${BASE_URL}?id=${id}&viewMode=story`}
      allowFullScreen
      scale={1}
      style={{
        width: '100%',
        height: '100%',
        border: '0 none',
      }}
    />
  </div>
);

const Story: React.FunctionComponent<StoryProps> = ({
  error,
  height,
  id,
  inline,
  storyFn,
  title,
}) => {
  if (error) {
    return <EmptyBlock>{error}</EmptyBlock>;
  }
  return inline ? (
    <InlineStory title={title} height={height} storyFn={storyFn} />
  ) : (
    <IFrameStory id={id} title={title} height={height} />
  );
};

export { Story };
