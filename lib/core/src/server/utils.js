import path from 'path';
import fs from 'fs';

export function parseList(str) {
  return str.split(',');
}

export function getEnvConfig(program, configEnv) {
  Object.keys(configEnv).forEach(fieldName => {
    const envVarName = configEnv[fieldName];
    const envVarValue = process.env[envVarName];
    if (envVarValue) {
      program[fieldName] = envVarValue; // eslint-disable-line
    }
  });
}

export function getMiddleware(configDir) {
  const middlewarePath = path.resolve(configDir, 'middleware.js');
  if (fs.existsSync(middlewarePath)) {
    let middlewareModule = require(middlewarePath); // eslint-disable-line
    if (middlewareModule.__esModule) { // eslint-disable-line
      middlewareModule = middlewareModule.default;
    }
    return middlewareModule;
  }
  return () => {};
}

const interpolate = (string, data = {}) =>
  Object.entries(data).reduce((acc, [k, v]) => acc.replace(`%${k}%`, v), string);

export function getPreviewBodyHtml() {
  return fs.readFileSync(path.resolve(__dirname, 'templates/base-preview-body.html'), 'utf8');
}

export function getPreviewHeadHtml(configDirPath, interpolations) {
  const base = fs.readFileSync(path.resolve(__dirname, 'templates/base-preview-head.html'), 'utf8');
  const headHtmlPath = path.resolve(configDirPath, 'preview-head.html');

  let result = base;

  if (fs.existsSync(headHtmlPath)) {
    result += fs.readFileSync(headHtmlPath, 'utf8');
  }

  return interpolate(result, interpolations);
}

export function getManagerHeadHtml(configDirPath, interpolations) {
  const base = fs.readFileSync(path.resolve(__dirname, 'templates/base-manager-head.html'), 'utf8');
  const scriptPath = path.resolve(configDirPath, 'manager-head.html');

  let result = base;

  if (fs.existsSync(scriptPath)) {
    result += fs.readFileSync(scriptPath, 'utf8');
  }

  return interpolate(result, interpolations);
}
