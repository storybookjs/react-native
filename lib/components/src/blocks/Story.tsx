import React from 'react';

import { IFrame } from './IFrame';
import { EmptyBlock } from './EmptyBlock';

const BASE_URL = 'iframe.html';

export enum StoryError {
  NO_STORY = 'No component or story to display',
}

interface CommonProps {
  title: string;
  height?: string;
}

type InlineStoryProps = {
  storyFn: () => React.ElementType;
} & CommonProps;

type IFrameStoryProps = {
  id: string;
} & CommonProps;

type ErrorProps = {
  error?: StoryError;
} & CommonProps;

// How do you XOR properties in typescript?
export type StoryProps = (InlineStoryProps | IFrameStoryProps | ErrorProps) & {
  inline: boolean;
};

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

/**
 * A story element, either renderend inline or in an iframe,
 * with configurable height.
 */
const Story: React.FunctionComponent<StoryProps> = props => {
  const { error } = props as ErrorProps;
  const { storyFn } = props as InlineStoryProps;
  const { id } = props as IFrameStoryProps;
  const { inline, title, height } = props;

  if (error) {
    return <EmptyBlock>{error}</EmptyBlock>;
  }
  return inline ? (
    <InlineStory storyFn={storyFn} title={title} height={height} />
  ) : (
    <IFrameStory id={id} title={title} height={height} />
  );
};

export { Story };
