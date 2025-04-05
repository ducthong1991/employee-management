import { useNavigate } from 'react-router-dom';
import { useAddEmployeeMutation } from './api/queries';
import { EmployeeFormData } from './schema';
import EmployeeForm from './EmployeeForm';

const AddEmployee = () => {
  const navigate = useNavigate();
  const addEmployeeMutation = useAddEmployeeMutation();

  const handleSubmit = (data: EmployeeFormData) => {
    addEmployeeMutation.mutate(data, {
      onSuccess: () => {
        navigate('/employees');
      },
    });
  };

  const handleCancel = () => {
    navigate('/employees');
  };

  return (
    <EmployeeForm
      isEditMode={false}
      isSubmitting={addEmployeeMutation.isPending}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default AddEmployee;
