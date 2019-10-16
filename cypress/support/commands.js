// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add(
  'console',
  {
    prevSubject: true,
  },
  (subject, method) => {
    // the previous subject is automatically received
    // and the commands arguments are shifted

    // allow us to change the console method used
    method = method || 'log';

    // log the subject to the console
    console[method]('The subject is', subject);

    // whatever we return becomes the new subject
    //
    // we don't want to change the subject so
    // we return whatever was passed in
    return subject;
  }
);

Cypress.Commands.add('preview', {}, () => {
  return cy.get(`#storybook-preview-iframe`).then({ timeout: 10000 }, iframe => {
    const content = iframe[0].contentDocument;
    const element = content !== null ? content.documentElement : null;

    return cy
      .wrap(iframe)
      .should(() => {
        expect(element).not.null;

        if (element !== null) {
          expect(element.querySelector('#root > *')).not.null;
        }
      })
      .then(() => {
        return element.querySelector('#root');
      });
  });
});
