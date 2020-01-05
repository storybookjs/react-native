import React, { FC, useContext } from 'react';
import { document } from 'global';
import { Anchor } from './Anchor';
import { DocsContext, DocsContextProps } from './DocsContext';
import { getDocsStories } from './utils';

type Decorator = (...args: any) => any;

interface MetaProps {
  title: string;
  component?: any;
  decorators?: [Decorator];
  parameters?: any;
}

function getFirstStoryId(docsContext: DocsContextProps): string {
  const stories = getDocsStories(docsContext);

  return stories.length > 0 ? stories[0].id : null;
}

function renderAnchor() {
  const context = useContext(DocsContext);
  // eslint-disable-next-line react/destructuring-assignment
  const anchorId = getFirstStoryId(context) || context.id;

  return <Anchor storyId={anchorId} />;
}

/**
 * This component is used to declare component metadata in docs
 * and gets transformed into a default export underneath the hood.
 */
export const Meta: FC<MetaProps> = () => {
  const params = new URL(document.location).searchParams;
  const isDocs = params.get('viewMode') === 'docs';

  return isDocs ? renderAnchor() : null;
};
