// cypress/support/index.d.ts
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to reset employee data in localStorage to a predefined initial state.
     * @example cy.resetEmployeeData()
     */
    resetEmployeeData(): Chainable<void>;
  }
}
