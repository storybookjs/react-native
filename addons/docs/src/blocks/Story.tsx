import React from 'react';
import { toId } from '@storybook/router';
import { Story, StoryProps as PureStoryProps } from '@storybook/components';
import { CURRENT_SELECTION } from './shared';

import { DocsContext, DocsContextProps } from './DocsContext';

interface StoryProps {
  id?: string;
  name?: string;
  children?: React.ReactElement;
  height?: string;
}

const inferInlineStories = (framework: string): boolean => {
  switch (framework) {
    case 'react':
      return true;
    default:
      return false;
  }
};

export const getStoryProps = (
  { id, name, height }: StoryProps,
  { id: currentId, storyStore, parameters, mdxKind }: DocsContextProps
): PureStoryProps => {
  const previewId = id === CURRENT_SELECTION ? currentId : id || (name && toId(mdxKind, name));
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
