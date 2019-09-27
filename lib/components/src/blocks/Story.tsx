import React from 'react';
import { IFrame } from './IFrame';
import { EmptyBlock } from './EmptyBlock';
import { ZoomContext } from './ZoomContext';

const BASE_URL = 'iframe.html';

export enum StoryError {
  NO_STORY = 'No component or story to display',
}

/** error message for Story with null storyFn
 * if the story id exists, it must be pointing to a non-existing story
 *  if there is assigned story id, the story must be empty
 */
const MISSING_STORY = (id?: string) => (id ? `Story "${id}" doesn't exist.` : StoryError.NO_STORY);

interface CommonProps {
  title: string;
  height?: string;
  id: string;
}

type InlineStoryProps = {
  storyFn: React.ElementType;
} & CommonProps;

type IFrameStoryProps = CommonProps;

type ErrorProps = {
  error?: StoryError;
} & CommonProps;

// How do you XOR properties in typescript?
export type StoryProps = (InlineStoryProps | IFrameStoryProps | ErrorProps) & {
  inline: boolean;
};

const InlineZoomWrapper: React.FC<{ scale: number }> = ({ scale, children }) => {
  return scale === 1 ? (
    <>{children}</>
  ) : (
    <div style={{ overflow: 'hidden' }}>
      <div
        style={{
          transform: `scale(${1 / scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
};

const InlineStory: React.FunctionComponent<InlineStoryProps> = ({ storyFn, height, id }) => (
  <div style={{ height }}>
    <ZoomContext.Consumer>
      {({ scale }) => (
        <InlineZoomWrapper scale={scale}>
          {storyFn ? React.createElement(storyFn) : <EmptyBlock>{MISSING_STORY(id)}</EmptyBlock>}
        </InlineZoomWrapper>
      )}
    </ZoomContext.Consumer>
  </div>
);

const IFrameStory: React.FunctionComponent<IFrameStoryProps> = ({
  id,
  title,
  height = '500px',
}) => (
  <div style={{ width: '100%', height }}>
    <ZoomContext.Consumer>
      {({ scale }) => {
        return (
          <IFrame
            key="iframe"
            id={`iframe--${id}`}
            title={title}
            src={`${BASE_URL}?id=${id}&viewMode=story`}
            allowFullScreen
            scale={scale}
            style={{
              width: '100%',
              height: '100%',
              border: '0 none',
            }}
          />
        );
      }}
    </ZoomContext.Consumer>
  </div>
);

/**
 * A story element, either renderend inline or in an iframe,
 * with configurable height.
 */
const Story: React.FunctionComponent<StoryProps> = props => {
  const { error } = props as ErrorProps;
  const { storyFn } = props as InlineStoryProps;
  const { id, inline, title, height } = props;

  if (error) {
    return <EmptyBlock>{error}</EmptyBlock>;
  }
  return inline ? (
    <InlineStory id={id} storyFn={storyFn} title={title} height={height} />
  ) : (
    <IFrameStory id={id} title={title} height={height} />
  );
};

export { Story };
