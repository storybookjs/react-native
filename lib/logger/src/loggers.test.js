import npmLog from 'npmlog';
import chalk from 'chalk';
import { nodeLogger, browserLogger } from './loggers';

jest.mock('npmlog', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('loggers', () => {
  beforeEach(() => {
    npmLog.info.mockReset();
    npmLog.warn.mockReset();
    npmLog.error.mockReset();
    global.console.log = jest.fn();
  });
  describe('nodeLogger', () => {
    it('should have an info method', () => {
      nodeLogger.info('information');
      expect(npmLog.info).toHaveBeenCalledWith('Info', 'information');
    });
    it('should have a warn method', () => {
      nodeLogger.warn('warning message');
      expect(npmLog.warn).toHaveBeenCalledWith('Warning', 'warning message');
    });
    it('should have an error method', () => {
      nodeLogger.error('error message');
      expect(npmLog.error).toHaveBeenCalledWith('Error', 'error message');
    });
  });

  describe('browserLogger', () => {
    it('should have an info method with blue `Info`', () => {
      browserLogger.info('information');
      const expectedMessage = `${chalk.blue('Info ')}information`;
      expect(global.console.log).toHaveBeenCalledWith(expectedMessage);
    });
    it('should have a warning method with yellow `Warn`', () => {
      browserLogger.warn('warning message');
      const expectedMessage = `${chalk.yellow('Warning ')}warning message`;
      expect(global.console.log).toHaveBeenCalledWith(expectedMessage);
    });
    it('should have an error method with red `Error`', () => {
      browserLogger.error('error message');
      const expectedMessage = `${chalk.red('Error ')}error message`;
      expect(global.console.log).toHaveBeenCalledWith(expectedMessage);
    });
  });
});
