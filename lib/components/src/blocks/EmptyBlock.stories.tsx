import React from 'react';
import { EmptyBlock } from './EmptyBlock';

import { DocsPageWrapper } from './DocsPage';

export default {
  title: 'Docs|EmptyBlock',
  Component: EmptyBlock,
  decorators: [getStory => <DocsPageWrapper>{getStory()}</DocsPageWrapper>],
};

export const error = () => <EmptyBlock>Generic error message</EmptyBlock>;
