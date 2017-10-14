import { FixturePage } from './app.po';
import 'jasmine';

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
