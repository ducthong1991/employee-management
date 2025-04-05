import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';

import Layout from './components/Layout';
import EmployeeList from './modules/employees';
import AddEmployee from './modules/employees/AddEmployee';
import EditEmployee from './modules/employees/EditEmployee';
import { initializeEmployeeData } from './modules/employees/api/employeeService';
import NotificationComponent from './components/NotificationComponent';

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
        element: <AddEmployee />,
      },
      {
        path: 'employees/edit/:id',
        element: <EditEmployee />,
      },
    ],
  },
]);

function App() {
  useEffect(() => {
    initializeEmployeeData();
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NotificationComponent />
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
