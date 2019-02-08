const { console } = global;

export const logger = {
  info: (message: any): void => console.log(message),
  warn: (message: any): void => console.warn(message),
  error: (message: any): void => console.error(message),
};
