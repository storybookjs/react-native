import React from 'react';
import Markdown from 'markdown-to-jsx';
import { DocsContainer, Description } from '@storybook/addon-docs/blocks';
import markdown from './markdown.stories.mdx';
import Readme from '../../README.md';

export default {
  title: 'Addons|Docs/mdx-in-story',
  decorators: [storyFn => <DocsContainer context={{}}>{storyFn()}</DocsContainer>],
};

// This renders the contents of the docs panel into story content
export const typography = () => {
  const Docs = markdown.parameters.docs.page;
  return <Docs />;
};

export const plainMD = () => <Readme />;

export const markdownToJsx = () => <Markdown>{Readme}</Markdown>;

export const markdownToDescription = () => <Description markdown={Readme} />;
