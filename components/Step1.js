// components/Step1.js
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const Step1 = ({ nextStep }) => {
  const { register, handleSubmit, formState: { errors } } = useFormContext();
  const [businessUrl, setBusinessUrl] = useState('');

  const onSubmit = (data) => {
    nextStep();
  };

  const handleBusinessNameChange = (event) => {
    const value = event.target.value.toLowerCase().replace(/\s+/g, '');
    setBusinessUrl(value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="onboarding-form">
      <div className="svg-placeholder">
        <img src="/undraw_Onboarding.png" alt="Onboarding" className="onboarding-image" />
      </div>
      <h1 className="heading">Let's get started</h1>
      <div className="form-group">
        <Label htmlFor="businessUrl">Business URL:</Label>
        <Input
          id="businessUrl"
          {...register('businessName', {
            required: 'Business URL is required',
            pattern: {
              value: /^[a-z0-9]+$/,
              message: 'No spaces or capital letters allowed',
            },
            onChange: handleBusinessNameChange,
          })}
        />
        {errors.businessName && <div className="error">{errors.businessName.message}</div>}
        <small className="muted-text">This URL cannot be changed later.</small>
        <small className="muted-text" style={{ display: 'block' }}>
          <span className="highlight">digimenu.mv/{businessUrl}</span>
        </small>


      </div>
      <Button type="submit" className="button">Next</Button>

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
          // font-weight: bold;
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
        .button {
          background-color: #FF8400;
          color: #FFFFFF;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
          margin-top: 1rem;
        }
        .button:hover {
          background-color: #FFB84D;
        }
      `}</style>
    </form>
  );
};

export default Step1;
