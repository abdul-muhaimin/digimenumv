"use client"
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaInstagram, FaViber, FaMapMarkerAlt, FaTelegram, FaFacebook, FaWhatsapp, FaTwitter } from 'react-icons/fa';

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
        setValue('bannerImageUrl', data.bannerImageUrl);
        setValue('avatarImageUrl', data.avatarImageUrl);
        setValue('location', data.location);
        setValue('storeDescription', data.storeDescription);

        const links = data.links || {};
        setValue('links.instaUrl', links.instaUrl);
        setValue('links.viberUrl', links.viberUrl);
        setValue('links.mapUrl', links.mapUrl);
        setValue('links.telegramUrl', links.telegramUrl);
        setValue('links.facebookUrl', links.facebookUrl);
        setValue('links.whatsappUrl', links.whatsappUrl);
        setValue('links.twitterUrl', links.twitterUrl);
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
    <div className="container mx-auto p-4">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4">
              <div className="mb-4">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name')} />
              </div>
              <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input id="email" {...register('email')} />
              </div>
              <div className="mb-4">
                <Label htmlFor="mobile">Mobile</Label>
                <Input id="mobile" {...register('mobile')} />
              </div>
              <div className="mb-4">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" {...register('businessName')} />
              </div>
              <div className="mb-4">
                <Label htmlFor="businessType">Business Type</Label>
                <Input id="businessType" {...register('businessType')} />
              </div>
              <div className="mb-4">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Input id="businessAddress" {...register('businessAddress')} />
              </div>
              <div className="mb-4">
                <Label htmlFor="businessIsland">Business Island</Label>
                <Input id="businessIsland" {...register('businessIsland')} />
              </div>
              <div className="mb-4">
                <Label htmlFor="businessAtoll">Business Atoll</Label>
                <Input id="businessAtoll" {...register('businessAtoll')} />
              </div>
              <div className="mb-4">
                <Label htmlFor="businessTelephone">Business Telephone</Label>
                <Input id="businessTelephone" {...register('businessTelephone')} />
              </div>
              <div className="mb-4">
                <Label htmlFor="bannerImageUrl">Banner Image URL</Label>
                <Input id="bannerImageUrl" {...register('bannerImageUrl')} />
              </div>
              <div className="mb-4">
                <Label htmlFor="avatarImageUrl">Avatar Image URL</Label>
                <Input id="avatarImageUrl" {...register('avatarImageUrl')} />
              </div>
              <div className="mb-4">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register('location')} />
              </div>
              <div className="mb-4">
                <Label htmlFor="instaUrl">Instagram URL</Label>
                <Input id="instaUrl" {...register('links.instaUrl')} />
              </div>
              <div className="mb-4">
                <Label htmlFor="viberUrl">Viber URL</Label>
                <Input id="viberUrl" {...register('links.viberUrl')} />
              </div>
              <div className="mb-4">
                <Label htmlFor="mapUrl">Map URL</Label>
                <Input id="mapUrl" {...register('links.mapUrl')} />
              </div>
              <div className="mb-4">
                <Label htmlFor="telegramUrl">Telegram URL</Label>
                <Input id="telegramUrl" {...register('links.telegramUrl')} />
              </div>
              <div className="mb-4">
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input id="facebookUrl" {...register('links.facebookUrl')} />
              </div>
              <div className="mb-4">
                <Label htmlFor="whatsappUrl">WhatsApp URL</Label>
                <Input id="whatsappUrl" {...register('links.whatsappUrl')} />
              </div>
              <div className="mb-4">
                <Label htmlFor="twitterUrl">Twitter URL</Label>
                <Input id="twitterUrl" {...register('links.twitterUrl')} />
              </div>
              <div className="mb-4">
                <Label htmlFor="storeDescription">Store Description</Label>
                <Input id="storeDescription" {...register('storeDescription')} />
              </div>
              <Button type="submit" className="w-full">
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetails;
