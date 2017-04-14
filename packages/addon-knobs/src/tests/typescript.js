import * as tt from 'typescript-definition-tester';
const { describe, it } = global;

describe('TypeScript definitions', function() {
  this.timeout(0);

  it('should compile against index.d.ts', done => {
    // This will test any typescript files in /examples/typescript against the type declarations.
    tt.compileDirectory(
      `${__dirname}/../../example/typescript`,
      fileName => fileName.match(/\.ts$/),
      () => done(),
    );
  });
});
