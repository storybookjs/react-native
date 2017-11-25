import { logger } from './.';

describe('loggers', () => {
  const initialConsole = { ...global.console };
  beforeEach(() => {
    global.console.log = jest.fn();
    global.console.warn = jest.fn();
    global.console.error = jest.fn();
  });
  afterAll(() => {
    global.console = initialConsole;
  });
  describe('browser-logger', () => {
    it('should have an info method with blue `Info`', () => {
      const message = 'information';
      logger.info(message);
      expect(global.console.log).toHaveBeenCalledWith(message);
    });
    it('should have a warning method with yellow `Warn`', () => {
      const message = 'warning message';
      logger.warn(message);
      expect(global.console.warn).toHaveBeenCalledWith(message);
    });
    it('should have an error method with red `Error`', () => {
      const message = 'error message';
      logger.error(message);
      expect(global.console.error).toHaveBeenCalledWith(message);
    });
  });
});
