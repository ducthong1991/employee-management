import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from './employeeService';
import { Employee } from '../types';
import { useNotification } from '../../../store/hooks';

export const employeesKeys = {
  employees: {
    all: ['employees'],
    detail: (id: string) => ['employees', id],
  },
};

// Query to get all employees
export const useEmployeesQuery = () => {
  const { showNotification } = useNotification();

  return useQuery<Employee[], Error>({
    queryKey: employeesKeys.employees.all,
    queryFn: fetchEmployees,
  });
};

// Query to get employee by ID
export const useEmployeeByIdQuery = (id: string) => {
  const { showNotification } = useNotification();

  return useQuery<Employee | null, Error>({
    queryKey: employeesKeys.employees.detail(id),
    queryFn: () => getEmployeeById(id),
    enabled: !!id, // Only run the query if id is provided
  });
};

// Mutation to add a new employee
export const useAddEmployeeMutation = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: (newEmployee: Omit<Employee, 'id'>) => addEmployee(newEmployee),
    onSuccess: employee => {
      // Invalidate the employees list query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: employeesKeys.employees.all });
      showNotification(
        `Employee ${employee.firstName} ${employee.lastName} added successfully!`,
        'success'
      );
    },
    onError: error => {
      showNotification(`Failed to add employee: ${error.message}`, 'error');
    },
  });
};

// Mutation to update an employee
export const useUpdateEmployeeMutation = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) => updateEmployee(id, data),
    onSuccess: updatedEmployee => {
      if (updatedEmployee) {
        // Invalidate both the list query and the specific employee query
        queryClient.invalidateQueries({ queryKey: employeesKeys.employees.all });
        queryClient.invalidateQueries({
          queryKey: employeesKeys.employees.detail(updatedEmployee.id),
        });
        showNotification(
          `Employee ${updatedEmployee.firstName} ${updatedEmployee.lastName} updated successfully!`,
          'success'
        );
      }
    },
    onError: error => {
      showNotification(`Failed to update employee: ${error.message}`, 'error');
    },
  });
};

// Mutation to delete an employee
export const useDeleteEmployeeMutation = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => {
      // Invalidate the employees list query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: employeesKeys.employees.all });
      showNotification('Employee deleted successfully!', 'success');
    },
    onError: error => {
      showNotification(`Failed to delete employee: ${error.message}`, 'error');
    },
  });
};
