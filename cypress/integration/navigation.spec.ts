import { visitApp } from '../helper';

describe('Actions', () => {
  beforeEach(() => {
    visitApp('official-storybook');
  });

  it('do something', () => {
    cy.contains('Invalid contrast').click();

    cy.url().should('include', 'path=/story/addons-a11y-basebutton--invalid-contrast');
  });
});
