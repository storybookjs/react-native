import { tag, mount, asCompiledCode } from '@storybook/riot';
import SimpleTestRaw from './SimpleTest.txt';
import './AnotherTest.tag';

const simpleTestCompiled = asCompiledCode(SimpleTestRaw);

export default {
  title: 'Story/Nest tags',
};

export const ThreeTags = () => ({
  tags: [
    '<WebPage><PageHeader>Simple title</PageHeader><PageBody>Simple Content</PageBody></WebPage>',
    '<PageHeader><h1><yield/></h1></PageHeader>',
    '<PageBody><div style="border-radius: 1em;border-right: solid 1px #cac9c9;border-bottom: solid 1px #cac9c9;box-shadow: 1em 1em 2em #eae9e9; margin: 3em; padding: 3em;min-height: 10em;min-width: 30em"><yield/></div></PageBody>',
  ],
});

ThreeTags.story = {
  name: 'Three tags',
};

export const Matriochka = () => ({
  tags: [
    '<Tag1><div>Inside tag1:<ul><li><Tag2><yield/></Tag2></li></ul></div></Tag1>',
    '<Tag2><div>Inside tag2:<ul><li><Tag3><yield/></Tag3></li></ul></div></Tag2>',
    '<Tag3><div>Inside tag3:<ul><li><Tag4><yield/></Tag4></li></ul></div></Tag3>',
    '<Tag4><div>Inside tag4:<ul><li><Tag5><yield/></Tag5></li></ul></div></Tag4>',
    '<Tag5><div>Inside tag5:<ul><li><yield/></li></ul></div></Tag5>',
  ],
  template: '<Matriochka><div><Tag1>Content</Tag1></div></Matriochka>',
});
