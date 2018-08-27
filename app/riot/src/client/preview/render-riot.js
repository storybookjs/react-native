import { document } from 'global';

const alreadyCompiledMarker = "var riot = require('riot')";

export function guessRootName(stringified) {
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

function compileText(compiler, code, rootName) {
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

export function renderStringified(
  { tags, template = `<${(tags[0] || []).boundAs || guessRootName(tags[0] || '')}/>` },
  { unregister, tag2, mount, compiler } // eslint-disable-line no-unused-vars
) {
  unregister('root');
  tags.forEach(oneTag => {
    const rootName = oneTag.boundAs || guessRootName(oneTag);
    const { content } = oneTag || {};
    const code = content ? content.trim() : oneTag || '';
    const compiled =
      code.indexOf(alreadyCompiledMarker) !== -1 ? code : compileText(compiler, code, rootName);
    unregister(rootName);
    eval(getRidOfRiotNoise(`${compiled}`)); // eslint-disable-line no-eval
  });
  const sourceCode = `<root>${template}</root>`;
  if (template !== '<root/>') eval(getRidOfRiotNoise(`${compiler.compile(sourceCode, {})}`)); // eslint-disable-line no-eval
  mount('*');
}

// eslint-disable-next-line no-unused-vars
export function renderRaw(sourceCode, { unregister, mount, compiler, tag2 }) {
  unregister('root');
  // eslint-disable-next-line no-eval
  eval(
    getRidOfRiotNoise(
      `${compiler.compile(sourceCode.replace(alreadyCompiledMarker, '').trim(), {})}`
    )
  );
  mount('root', /tag2\s*\(\s*'([^']+)'/.exec(sourceCode)[1], {});
}

export function renderCompiledObject(component, { rootElement }) {
  if (component.length) rootElement.appendChild(component[0].__.root); // eslint-disable-line no-underscore-dangle
}

export function render(component, context) {
  const { tags } = component || {};
  if (typeof component === 'string') {
    renderRaw(component, context);
    return true;
  }
  if (Array.isArray(tags)) {
    renderStringified(component, context);
    return true;
  }
  if (component && Array.isArray(component)) {
    renderCompiledObject(component, context);
    return true;
  }
  return false;
}
