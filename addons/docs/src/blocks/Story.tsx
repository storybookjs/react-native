import React from 'react';
import { Story, StoryProps as PureStoryProps } from '@storybook/components';
import { StoryFn } from '@storybook/addons';
import { CURRENT_SELECTION } from './shared';

import { DocsContext, DocsContextProps } from './DocsContext';

interface CommonProps {
  height?: string;
  inline?: boolean;
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
  { id: currentId, storyStore, parameters, mdxStoryNameToId }: DocsContextProps
): PureStoryProps => {
  const { id } = props as StoryRefProps;
  const { name } = props as StoryDefProps;
  const inputId = id === CURRENT_SELECTION ? currentId : id;
  const previewId = inputId || mdxStoryNameToId[name];

  const { height, inline } = props;
  const data = storyStore.fromId(previewId);
  const { framework = null } = parameters || {};

  // prefer props, then global options, then framework-inferred values
  const {
    inlineStories = inferInlineStories(framework),
    iframeHeight = undefined,
    prepareForInline = undefined,
  } = (parameters && parameters.docs) || {};

  const { storyFn = undefined, name: storyName = undefined } = data || {};

  if ((inlineStories || inline) && !prepareForInline) {
    throw new Error(
      `Story '${storyName}' is set to render inline, but no 'prepareForInline' function is implented in your docs configuration!`
    );
  }

  const storyIsInline = typeof inline === 'boolean' ? inline : inlineStories;
  return {
    inline: storyIsInline,
    id: previewId,
    storyFn: prepareForInline && storyFn ? () => prepareForInline(storyFn) : storyFn,
    height: height || (storyIsInline ? undefined : iframeHeight),
    title: storyName,
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
