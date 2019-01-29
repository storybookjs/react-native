const { console } = global;

export const logger = {
  log: (message: any): void => console.log(message),
  info: (message: any): void => console.log(message),
  warn: (message: any): void => console.warn(message),
  error: (message: any): void => console.error(message),
};
