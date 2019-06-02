import * as path from 'path';
import * as fs from 'fs';
import { getAngularAppTsConfigPath } from '../../lib/helpers';

export function readFileAsJson(jsonPath) {
  const filePath = path.resolve(jsonPath);
  if (!fs.existsSync(filePath)) {
    return false;
  }

  const jsonContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonContent);
}

export function writeFileAsJson(jsonPath, content) {
  const filePath = path.resolve(jsonPath);
  if (!fs.existsSync(filePath)) {
    return false;
  }

  const jsonContent = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  return true;
}

export function editStorybookTsConfig(tsconfigPath) {
  const tsConfigJson = readFileAsJson(tsconfigPath);
  const angularProjectTsConfigPath = getAngularAppTsConfigPath();
  tsConfigJson.extends = `../${angularProjectTsConfigPath}`;
  writeFileAsJson(tsconfigPath, tsConfigJson);
}
