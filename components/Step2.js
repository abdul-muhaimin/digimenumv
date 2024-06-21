// components/Step2.js
import React, { useEffect, useState } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Select from 'react-select';
import { PulseLoader } from 'react-spinners';

const options = [
  { value: 'Restaurant', label: 'Restaurant' },
  { value: 'Cafe', label: 'Cafe' },
  { value: 'Spa', label: 'Spa' },
  { value: 'Salon', label: 'Salon' },
  { value: 'WaterSport', label: 'WaterSport' },
  { value: 'Retailer', label: 'Retailer' },
  { value: 'Induvidual', label: 'Induvidual' },
  { value: 'Others', label: 'Others' }
];

const Step2 = ({ prevStep, handleSubmitData, loading }) => {
  const { register, handleSubmit, setValue, getValues, control, formState: { errors, isValid } } = useFormContext();
  const [selectedBusinessType, setSelectedBusinessType] = useState(null);

  useEffect(() => {
    register('businessType', { required: 'Business Type is required' });
  }, [register]);

  const onSubmit = (data) => {
    handleSubmitData(data);
  };

  const handleSelect = (option) => {
    setSelectedBusinessType(option);
    setValue('businessType', option.value, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="onboarding-form">
      <div className="svg-placeholder">
        <img src="/undraw_Onboarding.png" alt="Onboarding" className="onboarding-image" />
      </div>
      <h1 className="heading">Let's get started</h1>
      <div className="form-group">
        <Label htmlFor="name">Business Name</Label>
        <Input id="name" {...register('name', { required: 'Business Name is required' })} />
        {errors.name && <div className="error">{errors.name.message}</div>}
      </div>
      <div className="form-group">
        <Label htmlFor="businessType">Type</Label>
        <Select
          id="businessType"
          options={options}
          onChange={handleSelect}
          value={selectedBusinessType}
          placeholder="Select Business Type"
          styles={{
            control: (provided) => ({
              ...provided,
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '1px solid #CCCCCC',
              borderRadius: '4px',
              marginTop: '0.5rem'
            })
          }}
        />
        {errors.businessType && <div className="error">{errors.businessType.message}</div>}
      </div>
      <div className="form-group">
        <Label htmlFor="businessTelephone">Contact Number</Label>
        <Input id="businessTelephone" {...register('businessTelephone', { required: 'Contact Number is required' })} />
        {errors.businessTelephone && <div className="error">{errors.businessTelephone.message}</div>}
      </div>
      <small className="muted-text">These fields cannot be changed later.</small>
      <div className="button-group">
        <Button type="button" onClick={prevStep} className="button">Back</Button>
        <Button type="submit" className="button" disabled={!isValid || loading}>
          {loading ? <PulseLoader size={10} color={"#FFFFFF"} /> : 'Submit'}
        </Button>
      </div>

      <style jsx>{`
        .onboarding-form {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .heading {
          font-size: 1.5rem;
          color: #333333;
          margin-bottom: 1rem;
        }
        .form-group {
          margin-bottom: 1rem;
          width: 100%;
        }
        .error {
          color: red;
          margin-top: 0.5rem;
        }
        .muted-text {
          color: #777777;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }
        .highlight {
          font-weight: bold;
          color: #FF8400;
        }
        .svg-placeholder {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .onboarding-image {
          max-width: 100%;
          height: auto;
          max-height: 300px; /* Adjust as needed for better fit */
        }
        .dropdown-trigger {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid #CCCCCC;
          border-radius: 4px;
          margin-top: 0.5rem;
          cursor: pointer;
          text-align: left;
          background-color: white;
        }
        .dropdown-content {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid #CCCCCC;
          border-radius: 4px;
          margin-top: 0.5rem;
          background-color: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .button {
          background-color: #FF8400;
          color: #FFFFFF;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .button:disabled {
          background-color: #CCCCCC;
        }
        .button:hover:not(:disabled) {
          background-color: #FFB84D;
        }
        .button-group {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
      `}</style>
    </form>
  );
};

export default Step2;
