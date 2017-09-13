import { FixturePage } from './app.po';

describe('fixture App', function() {
  let page: FixturePage;

  beforeEach(() => {
    page = new FixturePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
