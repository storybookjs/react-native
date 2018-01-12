import { AppPage } from './app.po';
import 'jasmine';

describe('ng5test App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(<any>page.getParagraphText()).toEqual('Welcome to app!');
  });
});
