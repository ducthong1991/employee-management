import {
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTime } from 'luxon';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema, EmployeeFormData, emptyEmployeeFormData } from './schema';
import { useEffect } from 'react';

interface EmployeeFormProps {
  defaultValues?: EmployeeFormData;
  isEditMode: boolean;
  isSubmitting: boolean;
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

const EmployeeForm = ({
  defaultValues = emptyEmployeeFormData,
  isEditMode,
  isSubmitting,
  onSubmit,
  onCancel,
  onDirtyChange,
}: EmployeeFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (onDirtyChange) {
      onDirtyChange(isDirty);
    }
  }, [isDirty, onDirtyChange]);

  const dateOfBirth = watch('dateOfBirth');

  const formatDate = (date: DateTime | null): string => {
    if (!date) return '';

    try {
      if (!date.isValid) {
        return '';
      }
      return date.toFormat('yyyy-MM-dd');
    } catch (e) {
      console.error('Error formatting date:', e);
      return '';
    }
  };

  return (
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
                  <LocalizationProvider dateAdapter={AdapterLuxon}>
                    <DatePicker
                      {...field}
                      label="Date of Birth"
                      value={value ? DateTime.fromISO(value) : null}
                      onChange={date => {
                        if (date && date.isValid) {
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
                  <LocalizationProvider dateAdapter={AdapterLuxon}>
                    <DatePicker
                      {...field}
                      label="Joined Date"
                      value={value ? DateTime.fromISO(value) : null}
                      onChange={date => {
                        if (date && date.isValid) {
                          onChange(formatDate(date));
                        } else {
                          onChange('');
                        }
                      }}
                      minDate={dateOfBirth ? DateTime.fromISO(dateOfBirth) : undefined}
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
            <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
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
  );
};

export default EmployeeForm;
