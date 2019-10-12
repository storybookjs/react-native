describe('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8001/official-storybook/');
  });

  it('do something', () => {
    cy.contains('Invalid contrast').click();

    cy.url().should('include', 'path=/story/addons-a11y-basebutton--invalid-contrast');
  });
});
