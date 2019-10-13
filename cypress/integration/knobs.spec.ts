import { clickAddon, getStorybookPreview, visitExample } from '../helper';

describe('Knobs', () => {
  beforeEach(() => {
    visitExample('official-storybook', '?path=/story/addons-knobs-withknobs--tweaks-static-values');
  });

  it('[text] it should change a string value', () => {
    clickAddon('Knobs');

    cy.get('#Name').type('John Doe');
    getStorybookPreview().should('contain', 'My name is John Doe');
  });
});
