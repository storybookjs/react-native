import { expect, element, by } from 'detox';

describe('Story List', () => {
  it('should display story list', async () => {
    await element(by.id('BottomMenu.Navigator')).tap();

    await expect(element(by.id('Storybook.ListItem.Button.with text'))).toBeVisible();
  });

  it('should allow to switch story by clicking on it', async () => {
    await element(by.id('Storybook.ListItem.Button.with text')).tap();

    await element(by.id('BottomMenu.Preview')).tap();
    await expect(element(by.id('button--with-text'))).toBeVisible();
  });
});
