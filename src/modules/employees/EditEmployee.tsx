import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress, Alert, Stack } from '@mui/material';
import { useEmployeeByIdQuery, useUpdateEmployeeMutation } from './api/queries';
import { EmployeeFormData } from './schema';
import EmployeeForm from './EmployeeForm';
import NavigationPrompt from '@/components/NavigationPrompt';
import useBeforeUnloadWarning from '@/hooks/useBeforeUnloadWarning';

const EditEmployee = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDirty, setIsDirty] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const {
    data: existingEmployee,
    isLoading: isLoadingEmployee,
    error: fetchError,
  } = useEmployeeByIdQuery(id || '');

  const updateEmployeeMutation = useUpdateEmployeeMutation();
  useBeforeUnloadWarning(isDirty);

  const handleSubmit = (data: EmployeeFormData) => {
    if (id) {
      updateEmployeeMutation.mutate(
        { id, data },
        {
          onSuccess: () => {
            setIsDirty(false);
            navigate('/employees');
          },
        }
      );
    }
  };

  const handleDirtyChange = (isDirty: boolean) => {
    setIsDirty(isDirty);
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowPrompt(true);
    } else {
      navigate('/employees');
    }
  };

  const handleConfirmLeave = () => {
    setIsDirty(false);
    setShowPrompt(false);
    navigate('/employees');
  };

  const handleCancelLeave = () => {
    setShowPrompt(false);
  };

  if (isLoadingEmployee) {
    return (
      <Stack alignItems="center" mt={4}>
        <CircularProgress />
      </Stack>
    );
  }

  if (fetchError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load employee data: {fetchError.message}
      </Alert>
    );
  }

  if (!existingEmployee) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Employee not found
      </Alert>
    );
  }

  const { id: _, ...formData } = existingEmployee;

  return (
    <>
      <NavigationPrompt
        open={showPrompt}
        message="Form has been modified. You will lose your unsaved changes. Are you sure you want to leave this page?"
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
      />

      <EmployeeForm
        defaultValues={formData}
        isEditMode={true}
        isSubmitting={updateEmployeeMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onDirtyChange={handleDirtyChange}
      />
    </>
  );
};

export default EditEmployee;
