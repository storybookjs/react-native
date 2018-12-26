import { installableProjectTypes, supportedFrameworks } from './project_types';

describe('installableProjectTypes should have an entry for the supported framework', () => {
  supportedFrameworks.forEach(framework => {
    it(`${framework}`, () => {
      expect(installableProjectTypes.includes(framework.replace(/-/g, '_'))).toBe(true);
    });
  });
});
