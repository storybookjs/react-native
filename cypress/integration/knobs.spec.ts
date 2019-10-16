import { clickAddon, visitExample } from '../helper';

describe('Knobs', () => {
  beforeEach(() => {
    visitExample('official-storybook', '?path=/story/addons-knobs-withknobs--tweaks-static-values');
  });

  it('[text] it should change a string value', () => {
    clickAddon('Knobs');

    cy.get('#Name')
      .clear()
      .type('John Doe');

    cy.preview()
      .console('info')
      .find('p')
      .eq(0)
      .should('contain.text', 'My name is John Doe');
  });
});
