/* eslint-disable cypress/no-unnecessary-waiting */
export const getGreeting = () => cy.get('h1');

export const logInAsCoach = () => cy.viewport('macbook-13');
cy.visit(Cypress.env('appLoginUrl'));
cy.wait(4000);
cy.get('[data-cy="email_input"]').type('casey.hightower@outlook.com');
cy.get('[data-cy="password_input"]').type('mdctest1');
cy.get('[data-cy="Remember-me_button"]').click();
cy.get('[data-cy="Remember-me_button"]').should('be.checked');
cy.get('[data-cy="Remember-me_button"]').click();
cy.get('[data-cy="Remember-me_button"]').should('not.be.checked');
cy.get('[data-cy="submit_button"]').click();
cy.wait(4000);
cy.get('[href="/overview"]').should('be.visible');
