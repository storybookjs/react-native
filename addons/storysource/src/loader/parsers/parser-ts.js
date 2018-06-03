import parseTs from 'prettier/parser-typescript';

function parse(source) {
  return parseTs.parsers.typescript.parse(source);
}

export default {
  parse,
};
