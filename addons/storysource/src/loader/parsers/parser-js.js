import parseJs from 'prettier/parser-babylon';

function parse(source) {
  return parseJs(source);
}

export default {
  parse,
};
