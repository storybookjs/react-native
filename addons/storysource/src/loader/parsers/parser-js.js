import parseJs from 'prettier/parser-babylon';

function parse(source) {
  return parseJs.parsers.babel.parse(source);
}

export default {
  parse,
};
