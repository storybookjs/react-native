import React from 'react';
import notes from './notes/notes.md';
import mdxNotes from './notes/notes.mdx';
import DocgenButton from '../components/DocgenButton';

export default {
  title: 'Addons|Docs/stories',
  component: DocgenButton,
};

export const basic = () => <div>Click docs tab to see basic docs</div>;

export const withNotes = () => <div>Click docs tab to see DocsPage docs</div>;
withNotes.story = {
  name: 'with notes',
  parameters: { notes },
};

export const withInfo = () => <div>Click docs tab to see DocsPage docs</div>;
withInfo.story = {
  name: 'with info',
  parameters: {
    info: 'some user info string',
  },
};

export const mdxOverride = () => <div>Click docs tab to see MDX-overridden docs</div>;
mdxOverride.story = {
  name: 'mdx override',
  parameters: {
    docs: mdxNotes,
  },
};

export const jsxOverride = () => <div>Click docs tab to see JSX-overridden docs</div>;
jsxOverride.story = {
  name: 'jsx override',
  parameters: {
    docs: () => <div>Hello docs</div>,
  },
};
