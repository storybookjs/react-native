import * as path from 'path';
import * as fs from 'fs';
import { readFileAsJson, writeFileAsJson } from '../../lib/helpers';

export function getAngularJson() {
  const angularJsonPath = path.resolve('angular.json');
  if (!fs.existsSync(angularJsonPath)) {
    return false;
  }

  const jsonContent = fs.readFileSync(angularJsonPath, 'utf8');
  return JSON.parse(jsonContent);
}

export function getAngularAppTsConfigPath() {
  const angularJson = getAngularJson();
  const { defaultProject } = angularJson;
  const tsConfigPath = angularJson.projects[defaultProject].architect.build.options.tsConfig;

  if (!tsConfigPath || !fs.existsSync(path.resolve(tsConfigPath))) {
    return false;
  }
  return tsConfigPath;
}

export function getAngularAppTsConfigJson() {
  const tsConfigPath = getAngularAppTsConfigPath();

  if (!tsConfigPath || !fs.existsSync(path.resolve(tsConfigPath))) {
    return false;
  }

  const jsonContent = fs.readFileSync(tsConfigPath, 'utf8');
  return JSON.parse(jsonContent);
}

export function writeAngularAppTsConfig(tsConfigJson) {
  const content = `${JSON.stringify(tsConfigJson, null, 2)}\n`;
  const tsConfigPath = getAngularAppTsConfigPath();
  if (tsConfigPath) {
    fs.writeFileSync(path.resolve(tsConfigPath), content, 'utf8');
  }
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
