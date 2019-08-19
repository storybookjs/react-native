import React from 'react';
import markdown from './markdown.stories.mdx';

export default {
  title: 'Addons|Docs/mdx-in-story',
};

// This renders the contents of the docs panel into story content
export const typography = () => {
  const Docs = markdown.parameters.docs;
  return <Docs />;
};
