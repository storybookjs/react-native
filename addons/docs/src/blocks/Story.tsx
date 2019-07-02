import React from 'react';
import { toId } from '@storybook/router';
import { Story, StoryProps as PureStoryProps } from '@storybook/components';
import { CURRENT_SELECTION } from './shared';

import { DocsContext, DocsContextProps } from './DocsContext';

interface CommonProps {
  height?: string;
}

type StoryDefProps = {
  name: string;
  children: React.ReactNode;
} & CommonProps;

type StoryRefProps = {
  id?: string;
} & CommonProps;

export type StoryProps = StoryDefProps | StoryRefProps;

const inferInlineStories = (framework: string): boolean => {
  switch (framework) {
    case 'react':
      return true;
    default:
      return false;
  }
};

export const getStoryProps = (
  props: StoryProps,
  { id: currentId, storyStore, parameters, mdxKind }: DocsContextProps
): PureStoryProps => {
  const { id } = props as StoryRefProps;
  const { name } = props as StoryDefProps;
  const inputId = id === CURRENT_SELECTION ? currentId : id;
  const previewId = inputId || toId(mdxKind, name);

  const { height } = props;
  const data = storyStore.fromId(previewId);
  const { framework = null } = parameters || {};
  const { inlineStories = inferInlineStories(framework), iframeHeight = undefined } =
    (parameters && parameters.options && parameters.options.docs) || {};
  return {
    inline: inlineStories,
    id: previewId,
    storyFn: data && data.getDecorated(),
    height: height || iframeHeight,
    title: data && data.name,
  };
};

const StoryContainer: React.FunctionComponent<StoryProps> = props => (
  <DocsContext.Consumer>
    {context => {
      const storyProps = getStoryProps(props, context);
      return <Story {...storyProps} />;
    }}
  </DocsContext.Consumer>
);

StoryContainer.defaultProps = {
  children: null,
  name: null,
};

export { StoryContainer as Story };
