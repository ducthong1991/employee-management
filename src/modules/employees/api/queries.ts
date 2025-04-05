import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from './employeeService';
import { Employee } from '../types';

export const employeesKeys = {
  employees: {
    all: ['employees'],
    detail: (id: string) => ['employees', id],
  },
};

// Query to get all employees
export const useEmployeesQuery = () => {
  return useQuery<Employee[], Error>({
    queryKey: employeesKeys.employees.all,
    queryFn: fetchEmployees,
  });
};

// Query to get employee by ID
export const useEmployeeByIdQuery = (id: string) => {
  return useQuery<Employee | null, Error>({
    queryKey: employeesKeys.employees.detail(id),
    queryFn: () => getEmployeeById(id),
    enabled: !!id, // Only run the query if id is provided
  });
};

// Mutation to add a new employee
export const useAddEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newEmployee: Omit<Employee, 'id'>) => addEmployee(newEmployee),
    onSuccess: () => {
      // Invalidate the employees list query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: employeesKeys.employees.all });
    },
  });
};

// Mutation to update an employee
export const useUpdateEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) => updateEmployee(id, data),
    onSuccess: updatedEmployee => {
      if (updatedEmployee) {
        // Invalidate both the list query and the specific employee query
        queryClient.invalidateQueries({ queryKey: employeesKeys.employees.all });
        queryClient.invalidateQueries({
          queryKey: employeesKeys.employees.detail(updatedEmployee.id),
        });
      }
    },
  });
};

// Mutation to delete an employee
export const useDeleteEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => {
      // Invalidate the employees list query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: employeesKeys.employees.all });
    },
  });
};
