const { console } = global;

export const logger = {
  info: (message: any, ...rest: any[]): void => console.log(message, ...rest),
  warn: (message: any, ...rest: any[]): void => console.warn(message, ...rest),
  error: (message: any, ...rest: any[]): void => console.error(message, ...rest),
};
