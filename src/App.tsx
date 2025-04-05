import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';

import Layout from './components/Layout';
import EmployeeList from './modules/employees';
import EmployeeForm from './modules/employees/EmployeeForm';
import { initializeEmployeeData } from './modules/employees/api/employeeService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Create router with routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/employees" replace />,
      },
      {
        path: 'employees',
        element: <EmployeeList />,
      },
      {
        path: 'employees/new',
        element: <EmployeeForm />,
      },
      {
        path: 'employees/edit/:id',
        element: <EmployeeForm />,
      },
    ],
  },
]);

function App() {
  // Initialize localStorage with default data when the app starts
  useEffect(() => {
    initializeEmployeeData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
