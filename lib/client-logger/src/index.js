const { console } = global;

export const logger = {
  info: message => console.log(message),
  warn: message => console.warn(message),
  error: message => console.error(message),
};
