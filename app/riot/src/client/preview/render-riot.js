import { document } from 'global';
import { mount, unregister, tag2 as tag } from 'riot';
import compiler from 'riot-compiler';

const alreadyCompiledMarker = "var riot = require('riot')";

function guessRootName(stringified) {
  const whiteSpaceLocation = stringified.indexOf(' ', stringified.indexOf('<') + 1);
  const firstWhitespace = whiteSpaceLocation === -1 ? stringified.length : whiteSpaceLocation;
  const supposedName = stringified.trim().match(/^<[^ >]+\/>$/)
    ? stringified.trim().replace(/[<>/]/g, '')
    : stringified.substring(
        stringified.indexOf('<') + 1,
        Math.min(firstWhitespace, stringified.indexOf('>'))
      );
  const matchingBuiltInTag = document.createElement(supposedName).constructor.name;
  return matchingBuiltInTag === 'HTMLUnknownElement' ? supposedName : 'root';
}

function compileText(code, rootName) {
  const sourceCodeEndOfHtml =
    (Math.min(code.indexOf('<style') + 1, code.indexOf('<script') + 1) || code.length + 1) - 1;
  const sourceCodeReformatted =
    code.substring(0, sourceCodeEndOfHtml).replace(/[\n\r\s]+/g, ' ') +
    code.substring(sourceCodeEndOfHtml);
  const sourceCode =
    rootName === 'root' ? `<root>${sourceCodeReformatted}</root>` : sourceCodeReformatted;
  return compiler
    .compile(sourceCode, {})
    .replace(alreadyCompiledMarker, '')
    .trim();
}

const getRidOfRiotNoise = compiled =>
  compiled.replace(/riot\.tag2/g, 'tag2').replace(alreadyCompiledMarker, '');

function renderStringified({
  tags,
  template = `<${(tags[0] || []).boundAs || guessRootName(tags[0] || '')}/>`,
}) {
  const tag2 = tag; // eslint-disable-line no-unused-vars
  tags.forEach(oneTag => {
    const rootName = oneTag.boundAs || guessRootName(oneTag);
    const { content } = oneTag || {};
    const code = content ? content.trim() : oneTag || '';
    const compiled =
      code.indexOf(alreadyCompiledMarker) !== -1 ? code : compileText(code, rootName);
    unregister(rootName);
    eval(getRidOfRiotNoise(`${compiled}`)); // eslint-disable-line no-eval
  });
  const sourceCode = `<root>${template}</root>`;
  if (template !== '<root/>') eval(getRidOfRiotNoise(`${compiler.compile(sourceCode, {})}`)); // eslint-disable-line no-eval

  mount('*');
}

function renderRaw(sourceCode) {
  const tag2 = tag; // eslint-disable-line no-unused-vars
  // eslint-disable-next-line no-eval
  eval(
    getRidOfRiotNoise(
      `${compiler.compile(sourceCode.replace(alreadyCompiledMarker, '').trim(), {})}`
    )
  );
  mount('root', /tag2\s*\(\s*'([^']+)'/.exec(sourceCode)[1], {});
}

function renderCompiledButUnmounted(component) {
  mount('root', component.tagName, component.opts || {});
}

export function render(component) {
  if (typeof component === 'string') {
    renderRaw(component);
    return true;
  }
  const { tags } = component || {};
  if (Array.isArray(tags)) {
    renderStringified(component);
    return true;
  }
  if (component && component.tagName) {
    renderCompiledButUnmounted(component);
    return true;
  }
  if (component && component.length) {
    // already rendered, nothing to do
    return true;
  }
  return false;
}
