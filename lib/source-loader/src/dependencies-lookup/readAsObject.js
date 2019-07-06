import { getOptions } from 'loader-utils';
import path from 'path';
import injectDecorator from '../abstract-syntax-tree/inject-decorator';

function extractDependenciesFrom(tree) {
  return !Object.entries(tree || {}).length
    ? []
    : Object.entries(tree)
        .map(([, value]) =>
          (value.dependencies || []).concat(extractDependenciesFrom(value.localDependencies))
        )
        .reduce((acc, value) => acc.concat(value), []);
}

function extractLocalDependenciesFrom(tree) {
  return Object.assign(
    {},
    ...Object.entries(tree || {}).map(([thisPath, value]) =>
      Object.assign(
        { [thisPath]: { code: value.source || value.code } },
        extractLocalDependenciesFrom(value.localDependencies)
      )
    )
  );
}

function readAsObject(classLoader, inputSource, mainFile) {
  const options = getOptions(classLoader) || {};
  const { inspectLocalDependencies } = options;
  const result = injectDecorator(
    inputSource,
    classLoader.resourcePath,
    {
      ...options,
      parser: options.parser || classLoader.extension,
    },
    classLoader.emitWarning.bind(classLoader)
  );

  const sourceJson = JSON.stringify(result.storySource || inputSource)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  const addsMap = result.addsMap || {};
  const dependencies = result.dependencies || [];
  const source = mainFile ? result.source : inputSource;
  const idsToFrameworks = result.idsToFrameworks || {};
  const resource = classLoader.resourcePath || classLoader.resource;

  const moduleDependencies = (result.dependencies || []).filter(d => d[0] === '.' || d[0] === '/');
  const workspaceFileNames = inspectLocalDependencies
    ? moduleDependencies.map(d => path.join(path.dirname(resource), d))
    : [];

  return Promise.all(
    workspaceFileNames.map(
      d =>
        new Promise(resolve =>
          classLoader.loadModule(d, (err1, compiledSource, sourceMap, theModule) => {
            if (err1) {
              classLoader.emitError(err1);
            }
            classLoader.fs.readFile(theModule.resource, (err2, dependencyInputData) => {
              if (err2) {
                classLoader.emitError(err2);
              }
              resolve({
                d,
                err: err1 || err2,
                inputSource: dependencyInputData.toString(),
                compiledSource,
                sourceMap,
                theModule,
              });
            });
          })
        )
    )
  )
    .then(data =>
      Promise.all(
        data.map(({ inputSource: dependencyInputSource, theModule }) =>
          readAsObject(
            Object.assign({}, classLoader, {
              resourcePath: theModule.resourcePath,
              resource: theModule.resource,
              extension: (theModule.resource || '').split('.').slice(-1)[0],
            }),
            dependencyInputSource
          )
        )
      ).then(moduleObjects =>
        Object.assign(
          {},
          ...moduleObjects.map(asObject => ({
            [asObject.resource]: asObject,
          }))
        )
      )
    )
    .then(localDependencies => ({
      resource,
      source,
      sourceJson,
      addsMap,
      idsToFrameworks,
      dependencies: dependencies
        .concat(extractDependenciesFrom(localDependencies))
        .filter(d => d[0] !== '.' && d[0] !== '/')
        .map(d => (d[0] === '@' ? `${d.split('/')[0]}/${d.split('/')[1]}` : d.split('/')[0])),
      localDependencies: Object.assign(
        ...Object.entries(localDependencies).map(([name, value]) => ({
          [name]: { code: value.source },
        })),
        extractLocalDependenciesFrom(localDependencies)
      ),
    }));
}

export function readStory(classLoader, inputSource) {
  return readAsObject(classLoader, inputSource, true);
}
