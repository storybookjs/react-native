import { generate } from 'escodegen';

const BASIC_OPTIONS = {
  format: {
    indent: {
      style: '  ',
    },
    semicolons: false,
  },
};

const COMPACT_OPTIONS = {
  ...BASIC_OPTIONS,
  format: {
    newline: '',
  },
};

const PRETTY_OPTIONS = {
  ...BASIC_OPTIONS,
};

export function generateCode(ast: any, compact = false): string {
  return generate(ast, compact ? COMPACT_OPTIONS : PRETTY_OPTIONS);
}
