import { Employee } from '../types';

// Initial mock data
const initialEmployees: Employee[] = [
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

// Local storage key
const STORAGE_KEY = 'employees_data';

// Initialize localStorage with default data when app loads
export const initializeEmployeeData = (): void => {
  // Reset localStorage to initial data every time app runs
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEmployees));
};

// Get all employees from localStorage
export const fetchEmployees = async (): Promise<Employee[]> => {
  const storedData = localStorage.getItem(STORAGE_KEY);

  if (!storedData) {
    // If no data exists, initialize with default data
    initializeEmployeeData();
    return initialEmployees;
  }

  return JSON.parse(storedData);
};

// Get employee by ID
export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  const employees = await fetchEmployees();
  return employees.find(employee => employee.id === id) || null;
};

// Add new employee
export const addEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
  const employees = await fetchEmployees();

  // Generate a new ID (simple implementation for demo)
  const newId = Date.now().toString();

  const newEmployee: Employee = {
    ...employee,
    id: newId,
  };

  const updatedEmployees = [...employees, newEmployee];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEmployees));

  return newEmployee;
};

// Update existing employee
export const updateEmployee = async (
  id: string,
  updatedData: Partial<Employee>
): Promise<Employee | null> => {
  const employees = await fetchEmployees();
  const employeeIndex = employees.findIndex(employee => employee.id === id);

  if (employeeIndex === -1) {
    return null;
  }

  const updatedEmployee = {
    ...employees[employeeIndex],
    ...updatedData,
  };

  employees[employeeIndex] = updatedEmployee;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));

  return updatedEmployee;
};

// Delete employee
export const deleteEmployee = async (id: string): Promise<boolean> => {
  const employees = await fetchEmployees();
  const updatedEmployees = employees.filter(employee => employee.id !== id);

  if (updatedEmployees.length === employees.length) {
    return false; // No employee was deleted
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEmployees));
  return true;
};
