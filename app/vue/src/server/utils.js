import path from 'path';
import fs from 'fs';
import deprecate from 'util-deprecate';

const fallbackHeadUsage = deprecate(() => {},
'Usage of head.html has been deprecated. Please rename head.html to preview-head.html');

export function parseList(str) {
  return str.split(',');
}

export function getPreviewHeadHtml(configDirPath) {
  const headHtmlPath = path.resolve(configDirPath, 'preview-head.html');
  const fallbackHtmlPath = path.resolve(configDirPath, 'head.html');
  let headHtml = '';
  if (fs.existsSync(headHtmlPath)) {
    headHtml = fs.readFileSync(headHtmlPath, 'utf8');
  } else if (fs.existsSync(fallbackHtmlPath)) {
    headHtml = fs.readFileSync(fallbackHtmlPath, 'utf8');
    fallbackHeadUsage();
  }

  return headHtml;
}

export function getManagerHeadHtml(configDirPath) {
  const scriptPath = path.resolve(configDirPath, 'manager-head.html');
  let scriptHtml = '';
  if (fs.existsSync(scriptPath)) {
    scriptHtml = fs.readFileSync(scriptPath, 'utf8');
  }

  return scriptHtml;
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
