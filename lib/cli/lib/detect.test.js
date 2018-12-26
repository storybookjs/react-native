import { isStorybookInstalled } from './detect';
import { supportedFrameworks } from './project_types';

describe('isStorybookInstalled should return', () => {
  it('false if empty devDependency', () => {
    expect(isStorybookInstalled({ devDependencies: {} }, false)).toBe(false);
  });
  it('false if no devDependency', () => {
    expect(isStorybookInstalled({}, false)).toBe(false);
  });

  supportedFrameworks.forEach(framework => {
    it(`true if devDependencies has ${framework} Storybook version`, () => {
      const devDependencies = {};
      devDependencies[`@storybook/${framework}`] = '4.0.0-alpha.21';
      expect(isStorybookInstalled({ devDependencies }, false)).toBeTruthy();
    });
  });

  it('true if forced flag', () => {
    expect(
      isStorybookInstalled({
        devDependencies: { 'storybook/react': '4.0.0-alpha.21' },
      })
    ).toBe(false);
  });
});
