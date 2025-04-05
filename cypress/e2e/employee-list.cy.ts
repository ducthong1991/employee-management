/// <reference types="cypress" />

describe('Employee List', () => {
  beforeEach(() => {
    // Reset the employee data to a known state before each test
    cy.resetEmployeeData();
    // Visit the employees page
    cy.visit('/employees');
  });

  it('should display the data grid with employee data', () => {
    // Verify the data grid is loaded
    cy.get('.MuiDataGrid-root').should('be.visible');

    // Verify the initial employees are displayed
    cy.contains('John123').should('be.visible');
    cy.contains('Doe123').should('be.visible');
    cy.contains('Jane123').should('be.visible');
    cy.contains('Smith123').should('be.visible');

    // Verify column headers are visible
    cy.contains('First Name').should('be.visible');
    cy.contains('Last Name').should('be.visible');
    cy.contains('Email Address').should('be.visible');
    cy.contains('Phone Number').should('be.visible');
  });

  it('should navigate to edit employee page when edit button is clicked', () => {
    // Find and click the first edit button
    cy.get('[aria-label="Edit employee"]').first().click();

    // Verify we've navigated to the edit employee page
    cy.url().should('include', '/employees/edit/');
  });

  it('should open delete confirmation dialog when delete button is clicked', () => {
    // Find and click the first delete button
    cy.get('[aria-label="Delete employee"]').first().click();

    // Verify the delete confirmation dialog is displayed
    cy.contains('Confirm Delete').should('be.visible');
    cy.contains('Are you sure you want to delete this employee?').should('be.visible');

    // Verify the dialog has cancel and delete buttons
    cy.contains('button', 'Cancel').should('be.visible');
    cy.contains('button', 'Delete').should('be.visible');
  });

  it('should close delete confirmation dialog when cancel is clicked', () => {
    // Open the delete dialog
    cy.get('[aria-label="Delete employee"]').first().click();

    // Click cancel
    cy.contains('button', 'Cancel').click();

    // Verify the dialog is closed
    cy.contains('Confirm Delete').should('not.exist');
  });
});
