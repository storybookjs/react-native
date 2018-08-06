import npmLog from 'npmlog';
import { logger } from '.';

jest.mock('npmlog', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('node-logger', () => {
  beforeEach(() => {
    npmLog.info.mockReset();
    npmLog.warn.mockReset();
    npmLog.error.mockReset();
  });
  it('should have an info method', () => {
    const message = 'information';
    logger.info(message);
    expect(npmLog.info).toHaveBeenCalledWith('', message);
  });
  it('should have a warn method', () => {
    const message = 'warning message';
    logger.warn(message);
    expect(npmLog.warn).toHaveBeenCalledWith('', message);
  });
  it('should have an error method', () => {
    const message = 'error message';
    logger.error(message);
    expect(npmLog.error).toHaveBeenCalledWith('', message);
  });
});
