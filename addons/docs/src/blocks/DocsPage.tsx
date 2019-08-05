import React from 'react';

import { parseKind } from '@storybook/router';
import { styled } from '@storybook/theming';
import {
  DocsPage as PureDocsPage,
  DocsPageProps as PureDocsPageProps,
  PropsTable,
  PropsTableProps,
} from '@storybook/components';
import { DocsContext, DocsContextProps } from './DocsContext';
import { DocsContainer } from './DocsContainer';
import { Description, getDocgen } from './Description';
import { Story } from './Story';
import { Preview } from './Preview';
import { Props, getPropsTableProps } from './Props';

export type StringSlot = (context: DocsContextProps) => string | void;
export type PropsSlot = (context: DocsContextProps) => PropsTableProps | void;
export type StorySlot = (
  storyData: StoryData,
  isPrimary: boolean,
  context: DocsContextProps
) => DocsStoryProps;

export interface DocsPageProps {
  titleSlot: StringSlot;
  subtitleSlot: StringSlot;
  descriptionSlot: StringSlot;
  propsSlot: PropsSlot;
  storySlot: StorySlot;
}

interface DocsStoryProps {
  id: string;
  name: string;
  description?: string;
  expanded?: boolean;
}

interface StoryData {
  id: string;
  kind: string;
  name: string;
  parameters?: any;
}

const defaultTitleSlot: StringSlot = ({ selectedKind, parameters }) => {
  const {
    hierarchyRootSeparator: rootSeparator,
    hierarchySeparator: groupSeparator,
  } = (parameters && parameters.options) || {
    hierarchyRootSeparator: '|',
    hierarchySeparator: /\/|\./,
  };
  const { groups } = parseKind(selectedKind, { rootSeparator, groupSeparator });
  return (groups && groups[groups.length - 1]) || selectedKind;
};

const defaultSubtitleSlot: StringSlot = ({ parameters }) =>
  parameters && parameters.componentDescription;

const defaultPropsSlot: PropsSlot = context => getPropsTableProps({ of: '.' }, context);

const defaultDescriptionSlot: StringSlot = ({ parameters }) =>
  parameters && getDocgen(parameters.component);

const defaultStorySlot: StorySlot = (storyData, isPrimary, context) => storyData;

const StoriesHeading = styled.h2();
const StoryHeading = styled.h3();

const DocsStory: React.FunctionComponent<DocsStoryProps> = ({
  id,
  name,
  description,
  expanded = true,
}) => (
  <>
    {expanded && <StoryHeading>{name}</StoryHeading>}
    {expanded && description && <Description markdown={description} />}
    <Preview>
      <Story id={id} />
    </Preview>
  </>
);

const DocsPage: React.FunctionComponent<DocsPageProps> = ({
  titleSlot,
  subtitleSlot,
  descriptionSlot,
  propsSlot,
  storySlot,
}) => (
  <DocsContext.Consumer>
    {context => {
      const title = titleSlot(context) || '';
      const subtitle = subtitleSlot(context) || '';
      const description = descriptionSlot(context) || '';
      const propsTableProps = propsSlot(context);

      const { selectedKind, storyStore } = context;
      const componentStories = (storyStore.raw() as StoryData[]).filter(
        s => s.kind === selectedKind
      );
      const [primary, ...rest] = componentStories.map((storyData, idx) =>
        storySlot(storyData, idx === 0, context)
      );

      return (
        <PureDocsPage title={title} subtitle={subtitle}>
          <Description markdown={description} />
          <DocsStory {...primary} expanded={false} />
          {propsTableProps && <PropsTable {...propsTableProps} />}
          <StoriesHeading>Stories</StoriesHeading>
          {rest.map(story => story && <DocsStory {...story} expanded />)}
        </PureDocsPage>
      );
    }}
  </DocsContext.Consumer>
);

interface DocsPageWrapperProps {
  context: DocsContextProps;
  titleSlot?: StringSlot;
  subtitleSlot?: StringSlot;
  descriptionSlot?: StringSlot;
  propsSlot?: PropsSlot;
  storySlot?: StorySlot;
}

const DocsPageWrapper: React.FunctionComponent<DocsPageWrapperProps> = ({
  context,
  titleSlot = defaultTitleSlot,
  subtitleSlot = defaultSubtitleSlot,
  descriptionSlot = defaultDescriptionSlot,
  propsSlot = defaultPropsSlot,
  storySlot = defaultStorySlot,
}) => (
  /* eslint-disable react/destructuring-assignment */
  <DocsContainer
    context={{ ...context, mdxKind: context.selectedKind }}
    content={() => (
      <DocsPage {...{ titleSlot, subtitleSlot, descriptionSlot, storySlot, propsSlot }} />
    )}
  />
);

export { DocsPageWrapper as DocsPage };
