import * as path from 'path';
import * as fs from 'fs';
import { readFileAsJson, writeFileAsJson } from '../../lib/helpers';

export function getAngularAppTsConfigPath() {
  const angularJson = readFileAsJson('angular.json');
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

  return readFileAsJson(tsConfigPath);
}

function setStorybookTsconfigExtendsPath(tsconfigJson) {
  const angularProjectTsConfigPath = getAngularAppTsConfigPath();
  const newTsconfigJson = { ...tsconfigJson };
  newTsconfigJson.extends = `../${angularProjectTsConfigPath}`;
  return newTsconfigJson;
}

export function editStorybookTsConfig(tsconfigPath) {
  let tsConfigJson = readFileAsJson(tsconfigPath);
  tsConfigJson = setStorybookTsconfigExtendsPath(tsConfigJson);
  writeFileAsJson(tsconfigPath, tsConfigJson);
}

export function isDefaultProjectSet() {
  const angularJson = readFileAsJson('angular.json');
  return angularJson && !!angularJson.defaultProject;
}
