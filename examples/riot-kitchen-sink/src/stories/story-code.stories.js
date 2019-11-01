import { tag, mount, asCompiledCode } from '@storybook/riot';
import SimpleTestRaw from './SimpleTest.txt';
import './AnotherTest.tag';

const simpleTestCompiled = asCompiledCode(SimpleTestRaw);

export default {
  title: 'Story|How to create a story',
};

export const builtWithTag = () =>
  tag('test', '<div>simple test ({ opts.value })</div>', '', '', () => {}) &&
  mount('test', { value: 'with a parameter' });

builtWithTag.story = {
  name: 'built with tag',
};

export const builtAsString = () => ({ tags: ['<test><div>simple test</div></test>'] });

builtAsString.story = {
  name: 'built as string',
};

export const builtFromRawImport = () => simpleTestCompiled;

builtFromRawImport.story = {
  name: 'built from raw import',
};

export const builtFromTagsAndTemplate = () => ({
  tags: [{ content: SimpleTestRaw, boundAs: 'mustBeUniquePlease' }],
  template:
    '<SimpleTest test={ "with a parameter" } value={"value is mapped to riotValue"}></SimpleTest>',
});

builtFromTagsAndTemplate.story = {
  name: 'built from tags and template',
  parameters: {
    notes:
      'WARN : the tag file root element must have exactly the same name (or else you will see nothing)',
  },
};

export const tagsTemplateAndTagConstructorAtOnce = () => ({
  tags: [
    {
      content:
        "<SimpleTest><div>HACKED : {opts.hacked} ; simple test ({opts.test || 'without parameter'}). Oh, by the way ({opts.riotValue || '... well, nothing'})</div></SimpleTest>",
      boundAs: 'mustBeUniquePlease',
    },
  ],
  template:
    '<SimpleTest hacked={hacked} test={ "with a parameter" } value={"value is mapped to riotValue"}></SimpleTest>',
  tagConstructor: function tagConstructor() {
    this.hacked = true;
  },
});

tagsTemplateAndTagConstructorAtOnce.story = {
  name: 'tags, template and tagConstructor at once',
};

export const builtFromThePrecompilation = () => mount('anothertest', {});

builtFromThePrecompilation.story = {
  name: 'built from the precompilation',
  parameters: {
    notes: 'WARN, only works in lower case, never upper case with precompiled templates',
  },
};

export const theMountInstructionIsNotNecessary = () => ({ tagName: 'anothertest', opts: {} });

theMountInstructionIsNotNecessary.story = {
  name: 'the mount instruction is not necessary',
};

export const theOptsValueIsNotNecessary = () => ({ tagName: 'anothertest' });

theOptsValueIsNotNecessary.story = {
  name: 'the opts value is not necessary',
};
