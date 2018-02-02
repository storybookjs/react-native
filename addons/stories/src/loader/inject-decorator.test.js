import fs from 'fs';
import injectDecorator from './inject-decorator';

describe('inject-decorator', () => {
  describe('positive', () => {
    const source = fs.readFileSync('./__mocks__/inject-decorator.stories.txt', 'utf-8');
    const result = injectDecorator(source);

    it('returns "changed" flag', () => {
      expect(result.changed).toBeTruthy();
    });

    it('injects stories decorator after the all "storiesOf" functions', () => {
      expect(result.source).toMatchSnapshot();
    });

    it('calculates "adds" map', () => {
      expect(result.addsMap).toMatchSnapshot();
    });
  });

  it('will not change the source when there are no "storiesOf" functions', () => {
    const source = fs.readFileSync('./__mocks__/inject-decorator.no-stories.txt', 'utf-8');

    const result = injectDecorator(source);

    expect(result.changed).toBeFalsy();
    expect(result.addsMap).toEqual({});
    expect(result.source).toMatchSnapshot();
  });
});
