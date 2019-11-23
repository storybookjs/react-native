import { getFrameworks } from './frameworks';

const REACT = {
  '@storybook/react': '5.2.5',
};

const VUE = {
  '@storybook/vue': '5.2.5',
};

const NONE = {
  '@storybook/addons': '5.2.5',
  lodash: '^4.17.15',
};

describe('getFrameworks', () => {
  it('single framework', () => {
    const frameworks = getFrameworks({
      dependencies: NONE,
      devDependencies: REACT,
    });
    expect(frameworks).toEqual(['react']);
  });
  it('multi-framework', () => {
    const frameworks = getFrameworks({
      dependencies: VUE,
      devDependencies: REACT,
    });
    expect(frameworks.sort()).toEqual(['react', 'vue']);
  });
  it('no deps', () => {
    const frameworks = getFrameworks({});
    expect(frameworks).toEqual([]);
  });
  it('no framework', () => {
    const frameworks = getFrameworks({
      dependencies: NONE,
    });
    expect(frameworks).toEqual([]);
  });
});
