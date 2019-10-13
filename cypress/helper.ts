const baseUrl = 'http://localhost:8001';

type StorybookApps = 'official-storybook';

type Addons = 'Knobs';

export const visitExample = (app: StorybookApps, route = '') => {
  return cy.visit(`${baseUrl}/${app}/${route}`);
};

export const clickAddon = (addonName: Addons) => {
  return cy.get(`[role=tablist] button[role=tab]`).contains(addonName);
};

export const getStorybookPreview = () => {
  return cy.get('.sb-show-main');
};
