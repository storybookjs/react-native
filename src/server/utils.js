import path from 'path';
import fs from 'fs';

export function parseList(str) {
  return str.split(',');
}

export function getHeadHtml(configDirPath) {
  const headHtmlPath = path.resolve(configDirPath, 'head.html');
  let headHtml = '';
  if (fs.existsSync(headHtmlPath)) {
    headHtml = fs.readFileSync(headHtmlPath, 'utf8');
  }

  return headHtml;
}

export function getEnvConfig(program, configEnv) {
  Object.keys(configEnv).forEach((fieldName) => {
    const envVarName = configEnv[fieldName];
    const envVarValue = process.env[envVarName];
    if (envVarValue) {
      program[fieldName] = envVarValue; // eslint-disable-line no-param-reassign
    }
  });
}

export function getMiddleware(configDir) {
  const middlewarePath = path.resolve(configDir, 'middleware.js');
  if (fs.existsSync(middlewarePath)) {
    let middlewareModule = require(middlewarePath); // eslint-disable-line global-require
    if (middlewareModule.__esModule) {
      middlewareModule = middlewareModule.default;
    }
    return middlewareModule;
  }
  return function () {};
}
