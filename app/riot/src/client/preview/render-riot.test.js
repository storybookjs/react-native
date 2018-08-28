import { document } from 'global';
import { unregister, tag2, mount } from 'riot/riot';
import compiler from 'riot-compiler';
import { render } from './render-riot';

document.body = document.createElement('body');
const rootElement = document.body.appendChild(document.createElement('root'));

const context = {
  unregister,
  rootElement,
  compiler,
  tag2,
  mount,
};

beforeEach(() => {
  rootElement.innerHTML = '';
  unregister('root');
});

describe('render a riot element', () => {
  it('should not work with nothing', () => {
    expect(render(null, context)).toBe(false);

    expect(rootElement.innerHTML).toEqual('');
  });

  it('can work with some text', () => {
    expect(render({ tags: ['<div><p>some tests</p></div>'] }, context)).toBe(true);

    expect(rootElement.innerHTML).toEqual('<div><p>some tests</p></div>');
  });

  it('can work with raw code', () => {
    expect(render("riot.tag2('root', '<div>raw code</div>', '', '', () => {})", context)).toBe(
      true
    );

    expect(rootElement.innerHTML).toEqual('<div>raw code</div>');
  });

  it('can work with compiled code', () => {
    expect(render([], context)).toBe(true);
    // does only work in true mode, and not in jest mode
  });

  it('can nest several tags', () => {
    expect(
      render(
        {
          tags: [
            '<Tag1><div>Inside tag1:<ul><li><Tag2><yield/></Tag2></li></ul></div></Tag1>',
            '<Tag2><div>Inside tag2:<ul><li><Tag3><yield/></Tag3></li></ul></div></Tag2>',
            '<Tag3><div>Inside tag3:<ul><li><Tag4><yield/></Tag4></li></ul></div></Tag3>',
            '<Tag4><div>Inside tag4:<ul><li><Tag5><yield/></Tag5></li></ul></div></Tag4>',
            '<Tag5><div>Inside tag5:<ul><li><yield/></li></ul></div></Tag5>',
          ],
          template: '<Matriochka><div><Tag1>Content</Tag1></div></Matriochka>',
        },
        context
      )
    ).toBe(true);

    expect(rootElement.innerHTML).toMatchSnapshot();
  });

  it('can template some vars', () => {
    expect(
      render(
        {
          tags: [
            {
              content:
                "<SimpleTest><div>simple test ({opts.test || 'without parameter'}). Oh, by the way ({opts.riotValue || '... well, nothing'})</div></SimpleTest>",
              boundAs: 'mustBeUniquePlease',
            },
          ],
          template:
            '<SimpleTest test={ "with a parameter" } value={"value is mapped to riotValue"}></SimpleTest>',
        },
        context
      )
    ).toBe(true);

    expect(rootElement.innerHTML).toMatchSnapshot();
  });
});
