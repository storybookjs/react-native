import React from 'react';

import { parseKind } from '@storybook/router';
import { styled } from '@storybook/theming';
import { DocsPage as PureDocsPage, DocsPageProps } from '@storybook/components';
import { DocsContext, DocsContextProps } from './DocsContext';
import { DocsContainer } from './DocsContainer';
import { Description } from './Description';
import { Story } from './Story';
import { Preview } from './Preview';
import { Props } from './Props';

enum DocsStoriesType {
  ALL = 'all',
  PRIMARY = 'primary',
  REST = 'rest',
}

interface DocsStoriesProps {
  type?: DocsStoriesType;
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

const getDocsStories = (type: DocsStoriesType, componentStories: StoryData[]): DocsStoryProps[] => {
  let stories = componentStories;
  if (type !== DocsStoriesType.ALL) {
    const [first, ...rest] = stories;
    stories = type === DocsStoriesType.PRIMARY ? [first] : rest;
  }
  return stories.map(({ id, name, parameters: { notes, info } }) => ({
    id,
    name,
    description: notes || info || null,
  }));
};

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

const DocsStories: React.FunctionComponent<DocsStoriesProps> = ({ type = DocsStoriesType.ALL }) => (
  <DocsContext.Consumer>
    {({ selectedKind, storyStore }) => {
      const componentStories = (storyStore.raw() as StoryData[]).filter(
        s => s.kind === selectedKind
      );
      const stories = getDocsStories(type, componentStories);
      if (stories.length === 0) {
        return null;
      }
      const expanded = type !== DocsStoriesType.PRIMARY;
      return (
        <>
          {expanded && <StoriesHeading>Stories</StoriesHeading>}
          {stories.map(s => (
            <DocsStory key={s.id} expanded={expanded} {...s} />
          ))}
        </>
      );
    }}
  </DocsContext.Consumer>
);

const getDocsPageProps = (context: DocsContextProps): DocsPageProps => {
  const { selectedKind, selectedStory, parameters } = context;
  const {
    hierarchyRootSeparator: rootSeparator,
    hierarchySeparator: groupSeparator,
  } = (parameters && parameters.options) || {
    hierarchyRootSeparator: '|',
    hierarchySeparator: /\/|\./,
  };

  const { groups } = parseKind(selectedKind, { rootSeparator, groupSeparator });
  const title = (groups && groups[groups.length - 1]) || selectedKind;

  return {
    title,
    subtitle: parameters && parameters.componentDescription,
  };
};

const DocsPage: React.FunctionComponent = () => (
  <DocsContext.Consumer>
    {context => {
      const docsPageProps = getDocsPageProps(context);
      return (
        <PureDocsPage {...docsPageProps}>
          <Description of="." />
          <DocsStories type={DocsStoriesType.PRIMARY} />
          <Props of="." />
          <DocsStories type={DocsStoriesType.REST} />
        </PureDocsPage>
      );
    }}
  </DocsContext.Consumer>
);

interface DocsPageWrapperProps {
  context: DocsContextProps;
}

const DocsPageWrapper: React.FunctionComponent<DocsPageWrapperProps> = ({ context }) => (
  /* eslint-disable react/destructuring-assignment */
  <DocsContainer context={{ ...context, mdxKind: context.selectedKind }} content={DocsPage} />
);

export { DocsPageWrapper as DocsPage };
