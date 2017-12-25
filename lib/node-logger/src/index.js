import npmLog from 'npmlog';

export const logger = {
  info: message => npmLog.info('', message),
  warn: message => npmLog.warn('', message),
  error: message => npmLog.error('', message),
};
