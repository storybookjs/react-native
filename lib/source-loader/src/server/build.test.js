import { insertAfterImports } from './build';

const insert = 'INSERT\n';

describe('insertAfterImports', () => {
  it('no imports', () => {
    const noImports = `
foo bar;
baz;
    `.trim();
    expect(insertAfterImports(insert, noImports)).toMatchSnapshot();
  });

  it('imports', () => {
    const hasImports = `
import foo;
import bar;
whatever;
    `.trim();
    expect(insertAfterImports(insert, hasImports)).toMatchSnapshot();
  });
});
