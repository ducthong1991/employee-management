// Custom command to reset the local storage to a clean state for testing
Cypress.Commands.add('resetEmployeeData', () => {
  // Initial employees data that matches what's in your employeeService.ts
  const initialEmployees = [
    {
      id: '1',
      firstName: 'John123',
      lastName: 'Doe123',
      email: 'john.doe@example.com',
      phone: '88887777',
      gender: 'Male',
      dateOfBirth: '1990-05-15',
      position: 'Software Engineer',
      department: 'Engineering',
      joinedDate: '2022-01-15',
    },
    {
      id: '2',
      firstName: 'Jane123',
      lastName: 'Smith123',
      email: 'jane.smith@example.com',
      phone: '88888888',
      gender: 'Female',
      dateOfBirth: '1988-11-22',
      position: 'HR Manager',
      department: 'Human Resources',
      joinedDate: '2021-06-10',
    },
  ];

  localStorage.setItem('employees_data', JSON.stringify(initialEmployees));
});

export {};
