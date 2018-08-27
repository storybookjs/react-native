import { storiesOf } from '@storybook/riot';
import { tag2, mount } from 'riot';
import SimpleTestRaw from './SimpleTest.txt';
// eslint-disable-next-line no-unused-vars
import anothertest from './AnotherTest.tag';
import { asCompiledCode } from './compileNow';

const simpleTestCompiled = asCompiledCode(SimpleTestRaw);

storiesOf('Story|How to create a story', module)
  .add(
    'built with tag2',
    () =>
      tag2('test', '<div>simple test ({ opts.value })</div>', '', '', () => {}) &&
      mount('root', 'test', { value: 'with a parameter' })
  )

  .add('built as string', () => ({ tags: ['<test><div>simple test</div></test>'] }))

  .add('built from raw import', () => simpleTestCompiled)

  .add(
    'built from tags and template',
    () => ({
      tags: [{ content: SimpleTestRaw, boundAs: 'mustBeUniquePlease' }],
      template:
        '<SimpleTest test={ "with a parameter" } value={"value is mapped to riotValue"}></SimpleTest>',
    }),
    {
      notes:
        'WARN : the tag file root element must have exactly the same name (or else you will see nothing)',
    }
  )

  .add('built from the precompilation', () => mount('root', 'anothertest', {}), {
    notes: 'WARN, only works in lower case, never upper case with precompiled templates',
  });

storiesOf('Story|Nest tags', module)
  .add('Three tags', () => ({
    tags: [
      '<WebPage><PageHeader>Simple title</PageHeader><PageBody>Simple Content</PageBody></WebPage>',
      '<PageHeader><h1><yield/></h1></PageHeader>',
      '<PageBody><div style="border-radius: 1em;border-right: solid 1px #cac9c9;border-bottom: solid 1px #cac9c9;box-shadow: 1em 1em 2em #eae9e9; margin: 3em; padding: 3em;min-height: 10em;min-width: 30em"><yield/></div></PageBody>',
    ],
  }))

  .add('Matriochka', () => ({
    tags: [
      '<Tag1><div>Inside tag1:<ul><li><Tag2><yield/></Tag2></li></ul></div></Tag1>',
      '<Tag2><div>Inside tag2:<ul><li><Tag3><yield/></Tag3></li></ul></div></Tag2>',
      '<Tag3><div>Inside tag3:<ul><li><Tag4><yield/></Tag4></li></ul></div></Tag3>',
      '<Tag4><div>Inside tag4:<ul><li><Tag5><yield/></Tag5></li></ul></div></Tag4>',
      '<Tag5><div>Inside tag5:<ul><li><yield/></li></ul></div></Tag5>',
    ],
    template: '<Matriochka><div><Tag1>Content</Tag1></div></Matriochka>',
  }));
