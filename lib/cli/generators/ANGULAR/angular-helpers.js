import * as path from 'path';
import * as fs from 'fs';
import { readFileAsJson, writeFileAsJson } from '../../lib/helpers';

export function getAngularAppTsConfigPath() {
  const angularJson = readFileAsJson('angular.json', true);
  const { defaultProject } = angularJson;
  const tsConfigPath = angularJson.projects[defaultProject].architect.build.options.tsConfig;

  if (!tsConfigPath || !fs.existsSync(path.resolve(tsConfigPath))) {
    return false;
  }
  return tsConfigPath;
}

export function getAngularAppTsConfigJson() {
  const tsConfigPath = getAngularAppTsConfigPath();

  if (!tsConfigPath) {
    return false;
  }

  return readFileAsJson(tsConfigPath, true);
}

function setStorybookTsconfigExtendsPath(tsconfigJson) {
  const angularProjectTsConfigPath = getAngularAppTsConfigPath();
  const newTsconfigJson = { ...tsconfigJson };
  newTsconfigJson.extends = `../${angularProjectTsConfigPath}`;
  return newTsconfigJson;
}

export function editStorybookTsConfig(tsconfigPath) {
  let tsConfigJson;
  try {
    tsConfigJson = readFileAsJson(tsconfigPath);
  } catch (e) {
    if (e.name === 'SyntaxError' && e.message.indexOf('Unexpected token /') > -1) {
      throw new Error(`Comments are disallowed in ${tsconfigPath}`);
    }
    throw e;
  }
  tsConfigJson = setStorybookTsconfigExtendsPath(tsConfigJson);
  writeFileAsJson(tsconfigPath, tsConfigJson);
}

export function isDefaultProjectSet() {
  const angularJson = readFileAsJson('angular.json', true);
  return angularJson && !!angularJson.defaultProject;
}
