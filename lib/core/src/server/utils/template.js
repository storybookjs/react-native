import path from 'path';
import fs from 'fs';

const interpolate = (string, data = {}) =>
  Object.entries(data).reduce((acc, [k, v]) => acc.replace(new RegExp(`%${k}%`, 'g'), v), string);

export function getPreviewBodyHtml(configDirPath, interpolations) {
  const base = fs.readFileSync(
    path.resolve(__dirname, '../templates/base-preview-body.html'),
    'utf8'
  );

  const bodyHtmlPath = path.resolve(configDirPath, 'preview-body.html');
  let result = base;

  if (fs.existsSync(bodyHtmlPath)) {
    result = fs.readFileSync(bodyHtmlPath, 'utf8') + result;
  }

  return interpolate(result, interpolations);
}

export function getPreviewHeadHtml(configDirPath, interpolations) {
  const base = fs.readFileSync(
    path.resolve(__dirname, '../templates/base-preview-head.html'),
    'utf8'
  );
  const headHtmlPath = path.resolve(configDirPath, 'preview-head.html');

  let result = base;

  if (fs.existsSync(headHtmlPath)) {
    result += fs.readFileSync(headHtmlPath, 'utf8');
  }

  return interpolate(result, interpolations);
}

export function getManagerHeadHtml(configDirPath, interpolations) {
  const base = fs.readFileSync(
    path.resolve(__dirname, '../templates/base-manager-head.html'),
    'utf8'
  );
  const scriptPath = path.resolve(configDirPath, 'manager-head.html');

  let result = base;

  if (fs.existsSync(scriptPath)) {
    result += fs.readFileSync(scriptPath, 'utf8');
  }

  return interpolate(result, interpolations);
}
