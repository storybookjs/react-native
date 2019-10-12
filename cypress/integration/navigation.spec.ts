import { visitApp } from '../helper';

describe('Navigation and routing', () => {
  beforeEach(() => {
    visitApp('official-storybook');
  });

  it('should navigate to story addons-a11y-basebutton--default', () => {
    cy.get('#exploreraddons-a11y-basebutton--label').click();

    cy.url().should('include', 'path=/story/addons-a11y-basebutton--label');
  });

  it('should search navigation item', () => {
    cy.get('#storybook-explorer-searchfield')
      .click()
      .type('persisting the action logger');

    cy.get('.sidebar-container a')
      .should('contain', 'Persisting the action logger')
      .and('not.contain', 'a11y');
  });

  it('should display no results after searching a non-existing navigation item', () => {
    cy.get('#storybook-explorer-searchfield')
      .click()
      .type('zzzzzzzzzz');

    cy.get('.sidebar-container').should('contain', 'This filter resulted in 0 results');
  });
});
