import './commands';

// Prevent uncaught exception failures from failing tests
Cypress.on('uncaught:exception', () => {
  // returning false here prevents Cypress from failing the test
  return false;
});
