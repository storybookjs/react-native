import compiler from 'riot-compiler';

export function asCompiledCode(text) {
  return compiler
    .compile(text, {})
    .replace('var riot = require("riot")', '')
    .replace('riot.tag2(', 'tag2(');
}

export function compileNow(tag2, text) {
  // eslint-disable-next-line no-eval
  return tag2 && eval(asCompiledCode(text));
}
