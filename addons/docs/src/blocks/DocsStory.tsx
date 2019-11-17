import React, { FunctionComponent } from 'react';
import { H3 } from '@storybook/components/html';
import { DocsStoryProps } from './types';
import { Anchor } from './Anchor';
import { Description } from './Description';
import { Story } from './Story';
import { Preview } from './Preview';

export const DocsStory: FunctionComponent<DocsStoryProps> = ({
  id,
  name,
  expanded = true,
  withToolbar = false,
  parameters,
}) => (
  <Anchor storyId={id}>
    {expanded && <H3>{name}</H3>}
    {expanded && parameters && parameters.docs && parameters.docs.storyDescription && (
      <Description markdown={parameters.docs.storyDescription} />
    )}
    <Preview withToolbar={withToolbar}>
      <Story id={id} />
    </Preview>
  </Anchor>
);
