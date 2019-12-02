import React from 'react';
import notes from '../notes/notes.md';
import mdxNotes from '../notes/notes.mdx';
import { DocgenButton } from '../../components/DocgenButton';

const docsTitle = title => `Docs/${title}`;

export default {
  title: `Addons/${docsTitle('stories')}`,
  component: DocgenButton,
};

export const Basic = () => <div>Click docs tab to see basic docs</div>;

export const NoDocs = () => <div>Click docs tab to see no docs error</div>;
NoDocs.story = {
  name: 'no docs',
  parameters: { docs: { page: null } },
};

export const WithNotes = () => <div>Click docs tab to see DocsPage docs</div>;
WithNotes.story = {
  name: 'with notes',
  parameters: { notes },
};

export const WithInfo = () => <div>Click docs tab to see DocsPage docs</div>;
WithInfo.story = {
  name: 'with info',
  parameters: {
    info: 'some user info string',
  },
};

export const MdxOverride = () => <div>Click docs tab to see MDX-overridden docs</div>;
MdxOverride.story = {
  name: 'mdx override',
  parameters: {
    docs: { page: mdxNotes },
  },
};

export const JsxOverride = () => <div>Click docs tab to see JSX-overridden docs</div>;
JsxOverride.story = {
  name: 'jsx override',
  parameters: {
    docs: { page: () => <div>Hello docs</div> },
  },
};

export const DocsDisable = () => <div>This story shouldn't show up in DocsPage</div>;
DocsDisable.story = {
  parameters: {
    docs: { disable: true },
  },
};

export const LargerThanPreview = () => <div style={{ width: 1000, background: 'pink' }}>HUGE</div>;
