import { expect, element, by } from 'detox';

describe('Example', () => {
  it('should have welcome screen', async () => {
    await expect(element(by.id('welcome--to-storybook'))).toBeVisible();
  });
});
