/* eslint-disable import/no-extraneous-dependencies */
import { AppPage } from './app.po';
import 'jasmine';

describe('ng5test App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText() as any).toEqual('Welcome to app!');
  });
});
