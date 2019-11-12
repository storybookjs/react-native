type Deps = Record<string, string>;
interface PackageJson {
  dependencies?: Deps;
  devDependencies?: Deps;
}

const FRAMEWORKS = [
  'angular',
  'ember',
  'html',
  'marko',
  'mithril',
  'polymer',
  'preact',
  'rax',
  'react',
  'react-native',
  'riot',
  'svelte',
  'vue',
  'web-components',
];

export const getFrameworks = ({ dependencies, devDependencies }: PackageJson): string[] => {
  const allDeps: Deps = {};
  Object.assign(allDeps, dependencies || {});
  Object.assign(allDeps, devDependencies || {});

  return FRAMEWORKS.filter(f => !!allDeps[`@storybook/${f}`]);
};
