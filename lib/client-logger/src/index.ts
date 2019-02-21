const { console } = global;

/* tslint:disable: no-console */

export const logger = {
  debug: (message: any, ...rest: any[]): void => console.debug(message, ...rest),
  log: (message: any, ...rest: any[]): void => console.log(message, ...rest),
  info: (message: any, ...rest: any[]): void => console.info(message, ...rest),
  warn: (message: any, ...rest: any[]): void => console.warn(message, ...rest),
  error: (message: any, ...rest: any[]): void => console.error(message, ...rest),
};
