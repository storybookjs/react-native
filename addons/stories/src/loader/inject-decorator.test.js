import fs from 'fs';
import injectDecorator from './inject-decorator';

describe('inject-decorator', () => {
  it('injects stories decorator after the all "storiesOf" functions', () => {
    const source = fs.readFileSync('./__mocks__/inject-decorator.stories.txt', 'utf-8');

    const result = injectDecorator(source);

    expect(result.changed).toBeTruthy();
    expect(result.source).toMatchSnapshot();
  });

  it('will not change the source when there are no "storiesOf" functions', () => {
    const source = fs.readFileSync('./__mocks__/inject-decorator.no-stories.txt', 'utf-8');

    const result = injectDecorator(source);

    expect(result.changed).toBeFalsy();
    expect(result.source).toMatchSnapshot();
  });
});
