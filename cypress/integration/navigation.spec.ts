import { visitExample } from '../helper';

describe('Navigation', () => {
  beforeEach(() => {
    visitExample('official-storybook');
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

describe('Routing', () => {
  it('should navigate to story addons-a11y-basebutton--default', () => {
    visitExample('official-storybook');
    cy.get('#exploreraddons-a11y-basebutton--label').click();

    cy.url().should('include', 'path=/story/addons-a11y-basebutton--label');
  });

  it('should directly visit a certain story and render correctly', () => {
    visitExample('official-storybook', '?path=/story/addons-a11y-basebutton--label');

    cy.preview().should('contain.text', 'Testing the a11y addon');
  });
});
