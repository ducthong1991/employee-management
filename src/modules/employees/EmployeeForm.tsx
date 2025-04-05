import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import useNavigationGuard from '@/hooks/useNavigationGuard';
import NavigationPrompt from '@/components/NavigationPrompt';
import {
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema, EmployeeFormData, emptyEmployeeFormData } from './schema';
import {
  useEmployeeByIdQuery,
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
} from './api/queries';

const EmployeeForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const {
    data: existingEmployee,
    isLoading: isLoadingEmployee,
    error: fetchError,
  } = useEmployeeByIdQuery(id || '');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: formIsSubmitting, isDirty },
    watch,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: emptyEmployeeFormData,
    mode: 'onBlur',
  });

  // Use our new navigation guard hook
  const { showPrompt, handleConfirm, handleCancel, navigateSafely } = useNavigationGuard({
    isDirty,
    onConfirm: () => {
      // Reset the form when navigation is confirmed
      // This prevents the prompt from showing again if we
      // attempt to navigate after confirming
      reset(undefined, { keepDirty: false });
    },
  });

  const dateOfBirth = watch('dateOfBirth');

  const addEmployeeMutation = useAddEmployeeMutation();
  const updateEmployeeMutation = useUpdateEmployeeMutation();

  useEffect(() => {
    if (isEditMode && existingEmployee) {
      const { id, ...employeeData } = existingEmployee;
      reset(employeeData);
    }
  }, [isEditMode, existingEmployee, reset]);

  const formatDate = (date: Date | null): string => {
    if (!date) return '';

    try {
      if (isNaN(date.getTime())) {
        return '';
      }
      return date.toISOString().split('T')[0];
    } catch (e) {
      console.error('Error formatting date:', e);
      return '';
    }
  };

  const onSubmit = (data: EmployeeFormData) => {
    if (isEditMode && id) {
      updateEmployeeMutation.mutate(
        { id, data },
        {
          onSuccess: () => {
            reset(data, { keepDirty: false });
            navigate('/employees');
          },
        }
      );
    } else {
      addEmployeeMutation.mutate(data, {
        onSuccess: () => {
          reset(data, { keepDirty: false });
          navigate('/employees');
        },
      });
    }
  };

  const isSubmitting =
    formIsSubmitting || addEmployeeMutation.isPending || updateEmployeeMutation.isPending;

  if (isEditMode && isLoadingEmployee) {
    return (
      <Stack alignItems="center" mt={4}>
        <CircularProgress />
      </Stack>
    );
  }

  if (isEditMode && fetchError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load employee data: {fetchError.message}
      </Alert>
    );
  }

  return (
    <>
      <NavigationPrompt
        open={showPrompt}
        message="Form has been modified. You will lose your unsaved changes. Are you sure you want to leave this page?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <Stack component={Paper} spacing={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5">{isEditMode ? 'Edit Employee' : 'Add New Employee'}</Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={4}>
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ pb: 1, borderBottom: '1px solid #eee' }}>
                Personal Information
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      fullWidth
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      required
                    />
                  )}
                />

                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      fullWidth
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      required
                    />
                  )}
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email Address"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      required
                    />
                  )}
                />

                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Phone Number"
                      fullWidth
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      placeholder="+65 91234567 or 91234567"
                      required
                    />
                  )}
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                {/* Gender Radio Button Group */}
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <FormControl component="fieldset" error={!!errors.gender} required fullWidth>
                      <FormLabel component="legend">Gender</FormLabel>
                      <RadioGroup row {...field}>
                        <FormControlLabel value="Male" control={<Radio />} label="Male" />
                        <FormControlLabel value="Female" control={<Radio />} label="Female" />
                        <FormControlLabel value="Other" control={<Radio />} label="Other" />
                        <FormControlLabel
                          value="Prefer not to say"
                          control={<Radio />}
                          label="Prefer not to say"
                        />
                      </RadioGroup>
                      {errors.gender && (
                        <FormHelperText error>{errors.gender.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />

                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        {...field}
                        label="Date of Birth"
                        value={value ? new Date(value) : null}
                        onChange={date => {
                          if (date && !isNaN(date.getTime())) {
                            onChange(formatDate(date));
                          } else {
                            onChange('');
                          }
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            error: !!errors.dateOfBirth,
                            helperText: errors.dateOfBirth?.message,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Stack>
            </Stack>

            <Stack spacing={3}>
              <Typography variant="h6" sx={{ pb: 1, borderBottom: '1px solid #eee' }}>
                Employment Information
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Controller
                  name="position"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Position"
                      fullWidth
                      error={!!errors.position}
                      helperText={errors.position?.message}
                      required
                    />
                  )}
                />

                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Department"
                      fullWidth
                      error={!!errors.department}
                      helperText={errors.department?.message}
                      required
                    />
                  )}
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ width: '50%' }} spacing={2}>
                <Controller
                  name="joinedDate"
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        {...field}
                        label="Joined Date"
                        value={value ? new Date(value) : null}
                        onChange={date => {
                          if (date && !isNaN(date.getTime())) {
                            onChange(formatDate(date));
                          } else {
                            onChange('');
                          }
                        }}
                        minDate={dateOfBirth ? new Date(dateOfBirth) : undefined}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            error: !!errors.joinedDate,
                            helperText: errors.joinedDate?.message,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Stack>
            </Stack>

            <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
              <Button
                variant="outlined"
                onClick={() => navigateSafely('/employees')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ minWidth: 120 }}
              >
                {isSubmitting ? (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CircularProgress size={20} />
                    <Typography variant="button">
                      {isEditMode ? 'Updating...' : 'Saving...'}
                    </Typography>
                  </Stack>
                ) : isEditMode ? (
                  'Update Employee'
                ) : (
                  'Add Employee'
                )}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </>
  );
};

export default EmployeeForm;
