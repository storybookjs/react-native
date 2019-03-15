import { navigator } from 'global';

let _isWindows = false;
let _isMacintosh = false;
let _isLinux = false;
let _locale: string | undefined;
let _language: string | undefined;

export enum Platform {
  Mac,
  Linux,
  Windows,
}

export const isWindows = _isWindows;
export const isMacintosh = _isMacintosh;
export const isLinux = _isLinux;

if (typeof navigator === 'object') {
  const userAgent = navigator.userAgent;
  _isWindows = userAgent.indexOf('Windows') >= 0;
  _isMacintosh = userAgent.indexOf('Macintosh') >= 0;
  _isLinux = userAgent.indexOf('Linux') >= 0;
  _locale = navigator.language;
  _language = _locale;
}

export enum OperatingSystem {
  Windows = 1,
  Macintosh = 2,
  Linux = 3,
}

export const OS = _isMacintosh
  ? OperatingSystem.Macintosh
  : _isWindows
  ? OperatingSystem.Windows
  : OperatingSystem.Linux;
