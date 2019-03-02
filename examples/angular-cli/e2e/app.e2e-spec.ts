import { AppPage } from './app.po';
// tslint:disable-next-line:no-implicit-dependencies
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
