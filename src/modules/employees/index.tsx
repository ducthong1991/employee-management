import { Link } from 'react-router-dom';
import {
  Typography,
  Button,
  Paper,
  IconButton,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useState } from 'react';
import { Employee } from './types';
import { useEmployeesQuery, useDeleteEmployeeMutation } from './api/queries';

const EmployeeList = () => {
  const { data: employees, isLoading } = useEmployeesQuery();
  const deleteEmployeeMutation = useDeleteEmployeeMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const openDeleteDialog = (id: string) => {
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      deleteEmployeeMutation.mutate(employeeToDelete, {
        onSuccess: () => {
          closeDeleteDialog();
        },
      });
    }
  };

  // Format date function
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    {
      field: 'firstName',
      headerName: 'First Name',
      flex: 1,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'Email Address',
      flex: 1,
    },
    {
      field: 'phone',
      headerName: 'Phone Number',
      flex: 1,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 120,
    },
    {
      field: 'dateOfBirth',
      headerName: 'Date of Birth',
      flex: 1,
    },
    {
      field: 'position',
      headerName: 'Position',
      flex: 1,
    },
    {
      field: 'department',
      headerName: 'Department',
      flex: 1,
    },
    {
      field: 'joinedDate',
      headerName: 'Joined Date',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as Employee;
        return (
          <>
            <IconButton
              component={Link}
              to={`/employees/edit/${row.id}`}
              size="small"
              aria-label="Edit employee"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              size="small"
              onClick={() => openDeleteDialog(row.id)}
              aria-label="Delete employee"
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Employees</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/employees/new"
        >
          Add Employee
        </Button>
      </Box>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            loading={isLoading || deleteEmployeeMutation.isPending}
            rows={employees || []}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection={false}
            disableRowSelectionOnClick
          />
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this employee? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleteEmployeeMutation.isPending}
          >
            {deleteEmployeeMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EmployeeList;
