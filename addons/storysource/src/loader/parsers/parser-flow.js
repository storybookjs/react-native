import parseFlow from 'prettier/parser-flow';

function parse(source) {
  return parseFlow.parsers.flow.parse(source);
}

export default {
  parse,
};
