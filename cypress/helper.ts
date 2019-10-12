const baseUrl = 'http://localhost:8001';

type StorybookApps = 'official-storybook';

export const visitApp = (app: StorybookApps) => {
  return cy.visit(`${baseUrl}/${app}/`);
};
