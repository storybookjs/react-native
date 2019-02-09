import { info, warn, error } from 'npmlog';
import { logger } from '.';

jest.mock('npmlog', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('node-logger', () => {
  beforeEach(() => {
    // This feels odd but TypeScript doesn't understand that the imported
    // npmlog module is being wrapped by Jest so we are type casting here
    // in order to be allowed to call Jest's mockReset() method.
    ((info as any) as jest.MockInstance<any, any>).mockReset();
    ((warn as any) as jest.MockInstance<any, any>).mockReset();
    ((error as any) as jest.MockInstance<any, any>).mockReset();
  });
  it('should have an info method', () => {
    const message = 'information';
    logger.info(message);
    expect(info).toHaveBeenCalledWith('', message);
  });
  it('should have a warn method', () => {
    const message = 'warning message';
    logger.warn(message);
    expect(warn).toHaveBeenCalledWith('', message);
  });
  it('should have an error method', () => {
    const message = 'error message';
    logger.error(message);
    expect(error).toHaveBeenCalledWith('', message);
  });
});
