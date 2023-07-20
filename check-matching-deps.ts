import glob from 'glob';
import pkg from './package.json';

const packageGlobs = pkg.workspaces.packages;
console.log('packageGlobs', packageGlobs);

const packages = packageGlobs
  .map((packageName) => {
    return glob.sync(`./${packageName}/package.json`);
  })
  .flat();

console.log('checking the following locations ', packages);

type DepsComparison = Record<string, Record<string, string>>;

const depsLookup = packages.reduce((dependenciesMap, packagePath) => {
  const json = require(packagePath);

  const deps: [string, string][] = Object.entries(json.dependencies ?? {});

  const devDeps: [string, string][] = Object.entries(json.devDependencies ?? {});

  const currentDependencies = deps.concat(devDeps);

  return currentDependencies.reduce((depsMapSoFar, [currentDependency, version]) => {
    if (!depsMapSoFar[currentDependency]) {
      depsMapSoFar[currentDependency] = {
        [json.name]: version,
      };
    } else {
      depsMapSoFar[currentDependency][json.name] = version;
    }

    return depsMapSoFar;
  }, dependenciesMap);
}, {} as DepsComparison);

console.log('checking for mismatched versions of dependencies');

let sum = 0;

Object.entries(depsLookup).forEach(([dependency, versionsMap]) => {
  const versionValues = Object.values(versionsMap);

  if (versionValues.length > 1 && versionValues.some((v) => v !== versionValues[0])) {
    console.log({ dependency, versionsMap });

    sum++;
  }
});

console.log(`found ${sum} mismatched versions`);
