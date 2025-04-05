import { z } from 'zod';

// Define Zod schema for employee validation
export const employeeSchema = z
  .object({
    firstName: z
      .string()
      .min(6, 'First name must be at least 6 characters')
      .max(10, 'First name must not exceed 10 characters'),
    lastName: z
      .string()
      .min(6, 'Last name must be at least 6 characters')
      .max(10, 'Last name must not exceed 10 characters'),
    email: z.string().min(1, 'Email is required').email('Email is invalid'),
    phone: z
      .string()
      .min(1, 'Phone number is required')
      .regex(
        /^(\+65[ -]?)?[89]\d{7}$/,
        'Must be a valid Singapore phone number (e.g., +65 8123 4567 or 91234567)'
      ),
    gender: z.string().min(1, 'Gender is required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    position: z.string().min(1, 'Position is required'),
    department: z.string().min(1, 'Department is required'),
    joinedDate: z.string().min(1, 'Joined date is required'),
  })
  .refine(
    data => {
      // Skip validation if either date is empty
      if (!data.dateOfBirth || !data.joinedDate) return true;

      const dob = new Date(data.dateOfBirth);
      const joined = new Date(data.joinedDate);

      return joined > dob;
    },
    {
      message: 'Joined date must be after date of birth',
      path: ['joinedDate'], // This shows the error on the joinedDate field
    }
  );

// Type inference from the schema
export type EmployeeFormData = z.infer<typeof employeeSchema>;

// Default empty employee form data
export const emptyEmployeeFormData: EmployeeFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: '',
  dateOfBirth: '',
  position: '',
  department: '',
  joinedDate: '',
};
