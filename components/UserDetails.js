import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UserDetails = () => {
  const { isLoaded, user } = useUser();
  const [userData, setUserData] = useState(null);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (!isLoaded) {
      console.log('Clerk not fully loaded yet');
      return;
    }

    if (!user) {
      console.log('User is not available');
      return;
    }

    const fetchUserData = async () => {
      try {
        console.log('Fetching user data for user ID:', user.id);
        const response = await fetch(`/api/users/${user.id}`);

        console.log('Response status:', response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error text:', errorText);
          throw new Error(`Error fetching user data: ${errorText}`);
        }

        const data = await response.json();
        console.log('Fetched user data:', data);
        setUserData(data);

        // Set form values
        setValue('name', data.name);
        setValue('email', data.email);
        setValue('mobile', data.mobile);
        setValue('businessName', data.businessName);
        setValue('businessType', data.businessType);
        setValue('businessAddress', data.businessAddress);
        setValue('businessIsland', data.businessIsland);
        setValue('businessAtoll', data.businessAtoll);
        setValue('businessTelephone', data.businessTelephone);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast.error('Failed to fetch user data');
      }
    };

    fetchUserData();
  }, [isLoaded, user, setValue]);

  const onSubmit = async (data) => {
    try {
      console.log('Submitting form data:', data);
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error text:', errorText);
        throw new Error(`Error updating user data: ${errorText}`);
      }

      const updatedData = await response.json();
      console.log('Updated user data:', updatedData);
      setUserData(updatedData);
      toast.success('Details updated successfully');
    } catch (error) {
      console.error('Failed to update user data:', error);
      toast.error('An error occurred');
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</Label>
          <Input
            id="name"
            {...register('name')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</Label>
          <Input
            id="email"
            {...register('email')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile</Label>
          <Input
            id="mobile"
            {...register('mobile')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Business Name</Label>
          <Input
            id="businessName"
            {...register('businessName')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="businessType" className="block text-sm font-medium text-gray-700">Business Type</Label>
          <Input
            id="businessType"
            {...register('businessType')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700">Business Address</Label>
          <Input
            id="businessAddress"
            {...register('businessAddress')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="businessIsland" className="block text-sm font-medium text-gray-700">Business Island</Label>
          <Input
            id="businessIsland"
            {...register('businessIsland')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="businessAtoll" className="block text-sm font-medium text-gray-700">Business Atoll</Label>
          <Input
            id="businessAtoll"
            {...register('businessAtoll')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="businessTelephone" className="block text-sm font-medium text-gray-700">Business Telephone</Label>
          <Input
            id="businessTelephone"
            {...register('businessTelephone')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default UserDetails;
