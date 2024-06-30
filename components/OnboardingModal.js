import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Modal from './Modal';
import Step1 from './Step1';
import Step2 from './Step2';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const validationSchema = [
  Yup.object({
    url: Yup.string().required('Business URL is required'),
  }),
  Yup.object({
    name: Yup.string().required('Name is required'),
    businessType: Yup.string().required('Business Type is required'),
    businessTelephone: Yup.string().required('Business Telephone is required'),
  }),
];

const OnboardingModal = ({ isOpen, onClose, user, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const router = useRouter();

  const methods = useForm({
    resolver: yupResolver(validationSchema[currentStep]),
    defaultValues: { url: '', name: '', businessType: '', businessTelephone: '' },
    mode: 'onChange',
  });

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmitData = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${user.id}/submit-onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setQrCodeUrl(result.qrCodeUrl);
        toast.success('Onboarding completed successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        onComplete(data);
        setIsSubmitted(true);
      } else {
        console.error('API call failed', await response.text());
        toast.error('Submission failed. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error during API call:', error);
      toast.error('An error occurred. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMenuClick = () => {
    router.push('/my-qr');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <FormProvider {...methods}>
        <div className="onboarding-steps">
          {!isSubmitted ? (
            <>
              {currentStep === 0 && <Step1 nextStep={nextStep} />}
              {currentStep === 1 && <Step2 prevStep={prevStep} handleSubmitData={handleSubmitData} loading={loading} />}
            </>
          ) : (
            <div className="success-message">
              <img src={qrCodeUrl} alt="QR Code" className="qr-code-image" />
              <h1>Onboarding Completed!</h1>
              <p>Your onboarding is completed successfully. You can now create your menu.</p>
              <Button onClick={handleCreateMenuClick} className="button">Create Menu</Button>
            </div>
          )}
        </div>
      </FormProvider>
      <style jsx>{`
        .onboarding-steps {
          padding: 20px;
        }
        .success-message {
          text-align: center;
        }
        .qr-code-image {
          width: 150px;
          margin-bottom: 20px;
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
    </Modal>
  );
};

export default OnboardingModal;
