import parseJs from 'prettier/parser-babylon';

function parse(source) {
  return parseJs.parsers.babylon.parse(source);
}

export default {
  parse,
};
