import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { components as docsComponents } from '@storybook/components/html';
import { Story, StoryProps as PureStoryProps } from '@storybook/components';
import { CURRENT_SELECTION } from './shared';

import { DocsContext, DocsContextProps } from './DocsContext';

export const storyBlockIdFromId = (storyId: string) => `story--${storyId}`;

const resetComponents: Record<string, React.ElementType> = {};
Object.keys(docsComponents).forEach(key => {
  resetComponents[key] = (props: any) => React.createElement(key, props);
});

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
  const { inlineStories = inferInlineStories(framework), iframeHeight = undefined } =
    (parameters && parameters.docs) || {};
  return {
    inline: typeof inline === 'boolean' ? inline : inlineStories,
    id: previewId,
    storyFn: data && data.storyFn,
    height: height || iframeHeight,
    title: data && data.name,
  };
};

const StoryContainer: React.FunctionComponent<StoryProps> = props => (
  <DocsContext.Consumer>
    {context => {
      const storyProps = getStoryProps(props, context);
      return (
        <div id={storyBlockIdFromId(storyProps.id)}>
          <MDXProvider components={resetComponents}>
            <Story {...storyProps} />
          </MDXProvider>
        </div>
      );
    }}
  </DocsContext.Consumer>
);

StoryContainer.defaultProps = {
  children: null,
  name: null,
};

export { StoryContainer as Story };
