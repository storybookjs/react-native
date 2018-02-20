import fs from 'fs';
import injectDecorator from './inject-decorator';

const ADD_DECORATOR_STATEMENT = '.addDecorator(withStorySource(__STORY__, __ADDS_MAP__))';

describe('inject-decorator', () => {
  describe('positive', () => {
    const source = fs.readFileSync('./__mocks__/inject-decorator.stories.txt', 'utf-8');
    const result = injectDecorator(source, ADD_DECORATOR_STATEMENT);

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

  describe('positive - angular', () => {
    const source = fs.readFileSync('./__mocks__/inject-decorator.angular-stories.txt', 'utf-8');
    const result = injectDecorator(source, ADD_DECORATOR_STATEMENT);

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

  describe('stories with ugly comments', () => {
    const source = fs.readFileSync(
      './__mocks__/inject-decorator.ugly-comments-stories.txt',
      'utf-8'
    );
    const result = injectDecorator(source, ADD_DECORATOR_STATEMENT);

    it('should delete ugly comments from the generated story source', () => {
      expect(result.storySource).toMatchSnapshot();
    });
  });

  it('will not change the source when there are no "storiesOf" functions', () => {
    const source = fs.readFileSync('./__mocks__/inject-decorator.no-stories.txt', 'utf-8');

    const result = injectDecorator(source, ADD_DECORATOR_STATEMENT);

    expect(result.changed).toBeFalsy();
    expect(result.addsMap).toEqual({});
    expect(result.source).toMatchSnapshot();
  });
});
