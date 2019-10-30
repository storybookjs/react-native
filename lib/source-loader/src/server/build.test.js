import { insertAfterImports } from './build';

const insert = 'INSERT\n';

describe('insertAfterImports', () => {
  it('no imports', () => {
    const noImports = `
foo bar;
baz;
    `.trim();
    expect(insertAfterImports({}, insert, noImports)).toMatchSnapshot();
  });

  it('imports', () => {
    const hasImports = `
import './foo';
import './bar';
whatever;
    `.trim();
    expect(insertAfterImports({}, insert, hasImports)).toMatchSnapshot();
  });

  it('single-line imports', () => {
    const hasImports = `
import 'foo';
import { bar } from 'baz';
whatever;
    `.trim();
    expect(insertAfterImports({}, insert, hasImports)).toMatchSnapshot();
  });

  it('multi-line imports', () => {
    const hasImports = `
import 'foo';
import {
  bar
} from 'baz';
whatever;
    `.trim();
    expect(insertAfterImports({}, insert, hasImports)).toMatchSnapshot();
  });

  it('addon-notes', () => {
    const notesStory = `
    import React from 'react';

import BaseButton from '../components/BaseButton';
import markdownNotes from './notes/notes.md';

const markdownString = '...';
    `.trim();
    expect(insertAfterImports({}, insert, notesStory)).toMatchSnapshot();
  });
});
