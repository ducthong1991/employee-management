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
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Avatar,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Clear as ClearIcon, FileDownload as ExportIcon } from '@mui/icons-material';
import { useState, useMemo } from 'react';
import { Employee } from './types';
import { useEmployeesQuery, useDeleteEmployeeMutation } from './api/queries';
import { formatDate } from '@/utils/dateUtils';

const EmployeeList = () => {
  const { data: employees, isLoading } = useEmployeesQuery();
  const deleteEmployeeMutation = useDeleteEmployeeMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

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

  // Get unique departments and positions for filter chips
  const uniqueDepartments = useMemo(() => {
    return [...new Set(employees?.map(emp => emp.department) || [])];
  }, [employees]);

  const uniquePositions = useMemo(() => {
    return [...new Set(employees?.map(emp => emp.position) || [])];
  }, [employees]);

  // Filter employees based on search term and selected filters
  const filteredEmployees = useMemo(() => {
    if (!employees) return [];
    
    return employees.filter(employee => {
      const matchesSearch = searchTerm === '' || 
        Object.values(employee).some(value => 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesDepartment = selectedDepartments.length === 0 || 
        selectedDepartments.includes(employee.department);
      
      const matchesPosition = selectedPositions.length === 0 || 
        selectedPositions.includes(employee.position);
      
      return matchesSearch && matchesDepartment && matchesPosition;
    });
  }, [employees, searchTerm, selectedDepartments, selectedPositions]);

  const handleDepartmentFilter = (department: string) => {
    setSelectedDepartments(prev => 
      prev.includes(department) 
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };

  const handlePositionFilter = (position: string) => {
    setSelectedPositions(prev => 
      prev.includes(position) 
        ? prev.filter(p => p !== position)
        : [...prev, position]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedDepartments([]);
    setSelectedPositions([]);
  };

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    for (const id of selectedEmployeeIds) {
      await new Promise(resolve => {
        deleteEmployeeMutation.mutate(id, {
          onSuccess: () => resolve(true),
          onError: () => resolve(false),
        });
      });
    }
    setSelectedEmployeeIds([]);
    setBulkDeleteDialogOpen(false);
  };

  const closeBulkDeleteDialog = () => {
    setBulkDeleteDialogOpen(false);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['First Name', 'Last Name', 'Email', 'Phone', 'Gender', 'Date of Birth', 'Position', 'Department', 'Joined Date'],
      ...filteredEmployees.map(emp => [
        emp.firstName,
        emp.lastName,
        emp.email,
        emp.phone,
        emp.gender,
        formatDate(emp.dateOfBirth),
        emp.position,
        emp.department,
        formatDate(emp.joinedDate)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateAvatarColor = (name: string) => {
    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
      '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
      '#ff5722', '#795548', '#9e9e9e', '#607d8b'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    {
      field: 'avatar',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      hideable: false,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as Employee;
        const fullName = `${row.firstName} ${row.lastName}`;
        return (
          <Avatar
            sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: generateAvatarColor(fullName),
              fontSize: '0.875rem'
            }}
          >
            {getInitials(row.firstName, row.lastName)}
          </Avatar>
        );
      },
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      flex: 1,
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      flex: 1,
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.5,
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
      minWidth: 120,
      sortable: true,
      hideable: true,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 100,
      sortable: true,
      hideable: true,
    },
    {
      field: 'dateOfBirth',
      headerName: 'DOB',
      flex: 1,
      minWidth: 100,
      sortable: true,
      hideable: true,
      valueGetter: value => formatDate(value),
      sortComparator: (v1, v2, cellParams1, cellParams2) => {
        const date1 = new Date(cellParams1.row.dateOfBirth);
        const date2 = new Date(cellParams2.row.dateOfBirth);
        return date1.getTime() - date2.getTime();
      },
    },
    {
      field: 'position',
      headerName: 'Position',
      flex: 1,
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'department',
      headerName: 'Department',
      flex: 1,
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'joinedDate',
      headerName: 'Joined',
      flex: 1,
      minWidth: 100,
      sortable: true,
      hideable: true,
      valueGetter: value => formatDate(value),
      sortComparator: (v1, v2, cellParams1, cellParams2) => {
        const date1 = new Date(cellParams1.row.joinedDate);
        const date2 = new Date(cellParams2.row.joinedDate);
        return date1.getTime() - date2.getTime();
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as Employee;
        const rowIndex = (filteredEmployees || []).findIndex(emp => emp.id === row.id);
        return (
          <Box data-testid={`employee-row-${rowIndex}`}>
            <IconButton
              component={Link}
              to={`/employees/edit/${row.id}`}
              size="small"
              aria-label="Edit employee"
              data-testid={`edit-employee-${rowIndex}`}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              size="small"
              onClick={() => openDeleteDialog(row.id)}
              aria-label="Delete employee"
              data-testid={`delete-employee-${rowIndex}`}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h4">
          Employees ({filteredEmployees.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={exportToCSV}
            disabled={filteredEmployees.length === 0}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to="/employees/new"
            data-testid="add-employee-button"
          >
            Add Employee
          </Button>
        </Box>
      </Box>

      {/* Bulk Actions */}
      {selectedEmployeeIds.length > 0 && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'action.selected' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body1">
              {selectedEmployeeIds.length} employee(s) selected
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBulkDelete}
              disabled={deleteEmployeeMutation.isPending}
            >
              Delete Selected
            </Button>
          </Box>
        </Paper>
      )}

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchTerm('')} size="small">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* Department Filters */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Filter by Department:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {uniqueDepartments.map(department => (
              <Chip
                key={department}
                label={department}
                onClick={() => handleDepartmentFilter(department)}
                color={selectedDepartments.includes(department) ? 'primary' : 'default'}
                variant={selectedDepartments.includes(department) ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
        </Box>

        {/* Position Filters */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Filter by Position:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {uniquePositions.map(position => (
              <Chip
                key={position}
                label={position}
                onClick={() => handlePositionFilter(position)}
                color={selectedPositions.includes(position) ? 'secondary' : 'default'}
                variant={selectedPositions.includes(position) ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
        </Box>

        {/* Clear Filters */}
        {(searchTerm || selectedDepartments.length > 0 || selectedPositions.length > 0) && (
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={clearAllFilters}
              startIcon={<ClearIcon />}
            >
              Clear All Filters
            </Button>
          </Box>
        )}
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ 
          height: { xs: 400, sm: 500, md: 600 }, 
          width: '100%' 
        }}>
          <DataGrid
            loading={isLoading || deleteEmployeeMutation.isPending}
            rows={filteredEmployees || []}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
              sorting: {
                sortModel: [{ field: 'lastName', sort: 'asc' }],
              },
              columns: {
                columnVisibilityModel: {
                  phone: false,
                  gender: false,
                  dateOfBirth: false,
                  joinedDate: false,
                },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            checkboxSelection={true}
            disableRowSelectionOnClick
            rowSelectionModel={selectedEmployeeIds}
            onRowSelectionModelChange={(newSelection) => {
              setSelectedEmployeeIds(newSelection as string[]);
            }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            sx={{
              '& .MuiDataGrid-main': {
                '& .MuiDataGrid-cell': {
                  padding: { xs: '4px 8px', sm: '8px 16px' },
                },
                '& .MuiDataGrid-columnHeader': {
                  padding: { xs: '4px 8px', sm: '8px 16px' },
                },
              },
              '& .MuiDataGrid-toolbarContainer': {
                padding: { xs: '8px', sm: '16px' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 },
              },
            }}
          />
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        isDeleting={deleteEmployeeMutation.isPending}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <BulkDeleteConfirmationDialog
        open={bulkDeleteDialogOpen}
        onClose={closeBulkDeleteDialog}
        onConfirm={confirmBulkDelete}
        isDeleting={deleteEmployeeMutation.isPending}
        selectedCount={selectedEmployeeIds.length}
      />
    </div>
  );
};

export default EmployeeList;

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface BulkDeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  selectedCount: number;
}

const BulkDeleteConfirmationDialog: React.FC<BulkDeleteConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  isDeleting,
  selectedCount,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="bulk-delete-dialog-title"
      aria-describedby="bulk-delete-dialog-description"
    >
      <DialogTitle id="bulk-delete-dialog-title">Confirm Bulk Delete</DialogTitle>
      <DialogContent>
        <DialogContentText id="bulk-delete-dialog-description">
          Are you sure you want to delete {selectedCount} employee(s)? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : `Delete ${selectedCount} Employee(s)`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
