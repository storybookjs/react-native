import parseTs from 'prettier/parser-typescript';

function parse(source) {
  return parseTs(source);
}

export default {
  parse,
};
