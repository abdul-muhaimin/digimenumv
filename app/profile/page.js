"use client";
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useUser } from '@clerk/nextjs';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageCropper from '@/components/ImageCropper';
import Spinner from '@/components/ui/Spinner';
import Navbar from '@/components/layout/SideBar';

// Fetcher function for SWR
const fetcher = url => fetch(url).then(res => res.json());

const UserDetails = () => {
  const { isLoaded, user } = useUser();
  const { register, handleSubmit, setValue, control, reset } = useForm();
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [croppedAvatar, setCroppedAvatar] = useState(null);
  const [croppedBanner, setCroppedBanner] = useState(null);
  const [isAvatarCropping, setIsAvatarCropping] = useState(false);
  const [isBannerCropping, setIsBannerCropping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // SWR hook to fetch user data
  const { data: userData, error } = useSWR(isLoaded ? `/api/users/${user.id}` : null, fetcher, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (userData) {
      setValue('name', userData.name || 'Not available');
      setValue('email', userData.email || 'Not available');
      setValue('mobile', userData.mobile || 'Not available');
      setValue('businessName', userData.businessName || 'Not available');
      setValue('businessType', userData.businessType || 'Not available');
      setValue('businessAddress', userData.businessAddress || 'Not available');
      setValue('businessIsland', userData.businessIsland || 'Not available');
      setValue('businessAtoll', userData.businessAtoll || 'Not available');
      setValue('businessTelephone', userData.businessTelephone || 'Not available');
      setValue('location', userData.location || 'Not available');
      setValue('storeDescription', userData.storeDescription || 'Not available');
      setValue('links.instagram', userData.links?.instagram || 'Not available');
      setValue('links.viber', userData.links?.viber || 'Not available');
      setValue('links.map', userData.links?.map || 'Not available');
      setValue('links.telegram', userData.links?.telegram || 'Not available');
      setValue('links.facebook', userData.links?.facebook || 'Not available');
      setValue('links.whatsapp', userData.links?.whatsapp || 'Not available');
      setValue('links.twitter', userData.links?.twitter || 'Not available');
      setValue('url', userData.url || ''); // Set the new field
    }
  }, [userData, setValue]);

  const handleImageChange = (setSelectedImage, setIsCropping) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (image, endpoint) => {
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Error uploading image');
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      toast.error('Failed to upload image');
      return null;
    }
  };

  const handleSubmitForm = async (data) => {
    setIsSubmitting(true);
    try {
      if (croppedAvatar) {
        const avatarUrl = await uploadImage(croppedAvatar, '/api/users/avatar');
        if (avatarUrl) data.avatarImageUrl = avatarUrl;
        setCroppedAvatar(null); // Clear the cropped avatar
      }

      if (croppedBanner) {
        const bannerUrl = await uploadImage(croppedBanner, '/api/users/banner');
        if (bannerUrl) data.bannerImageUrl = bannerUrl;
        setCroppedBanner(null); // Clear the cropped banner
      }

      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Error updating user data');
      const updatedData = await response.json();
      toast.success('Details updated successfully');
    } catch (error) {
      toast.error('Failed to update user data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCropComplete = (setCroppedImage, setIsCropping) => (croppedImage) => {
    setCroppedImage(croppedImage);
    setIsCropping(false);
  };

  const handleRemoveImage = async (type) => {
    if (!userData) return;

    const endpoint = type === 'avatar' ? '/api/users/avatar/delete' : '/api/users/banner/delete';
    const imageUrl = type === 'avatar' ? userData.avatarImageUrl : userData.bannerImageUrl;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) throw new Error('Error deleting image');

      const updatedData = await fetch(`/api/users/${user.id}`);
      const newData = await updatedData.json();
      setUserData(newData);

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} image removed successfully`);
    } catch (error) {
      toast.error(`Failed to remove ${type} image`);
    }
  };

  const watchedFields = useWatch({ control });
  const isChanged = JSON.stringify(watchedFields) !== JSON.stringify(userData) || croppedAvatar || croppedBanner;

  const handleCancel = () => {
    reset(userData);
    setSelectedAvatar(null);
    setCroppedAvatar(null);
    setSelectedBanner(null);
    setCroppedBanner(null);
  };

  if (error) {
    return <div>Error loading user data</div>;
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="" style={{ backgroundColor: '#FFFFFF' }}>
      <div className=" p-4 rounded-md shadow-lg" style={{ backgroundColor: '#F5F5F5' }}>
        <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: '#333333' }}>User Details</h2>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-brandBlack">Name</Label>
              <Input id="name" {...register('name')} className="border-brandOrange focus:ring-brandOrange" style={{ backgroundColor: '#FFFFFF', color: '#333333' }} />
            </div>
            <div>
              <Label htmlFor="email" className="text-brandBlack">Email</Label>
              <Input id="email" {...register('email')} className="border-brandOrange focus:ring-brandOrange" style={{ backgroundColor: '#FFFFFF', color: '#333333' }} />
            </div>
            <div>
              <Label htmlFor="mobile" className="text-brandBlack">Mobile</Label>
              <Input id="mobile" {...register('mobile')} className="border-brandOrange focus:ring-brandOrange" style={{ backgroundColor: '#FFFFFF', color: '#333333' }} />
            </div>
            <div>
              <Label htmlFor="businessName" className="text-brandBlack">Business Name</Label>
              <Input id="businessName" {...register('businessName')} className="border-brandOrange focus:ring-brandOrange" style={{ backgroundColor: '#FFFFFF', color: '#333333' }} />
            </div>
            <div>
              <Label htmlFor="businessType" className="text-brandBlack">Business Type</Label>
              <Input id="businessType" {...register('businessType')} className="border-brandOrange focus:ring-brandOrange" style={{ backgroundColor: '#FFFFFF', color: '#333333' }} />
            </div>
            <div>
              <Label htmlFor="businessAddress" className="text-brandBlack">Business Address</Label>
              <Input id="businessAddress" {...register('businessAddress')} className="border-brandOrange focus:ring-brandOrange" style={{ backgroundColor: '#FFFFFF', color: '#333333' }} />
            </div>
            <div>
              <Label htmlFor="businessIsland" className="text-brandBlack">Business Island</Label>
              <Input id="businessIsland" {...register('businessIsland')} className="border-brandOrange focus:ring-brandOrange" style={{ backgroundColor: '#FFFFFF', color: '#333333' }} />
            </div>
            <div>
              <Label htmlFor="businessAtoll" className="text-brandBlack">Business Atoll</Label>
              <Input id="businessAtoll" {...register('businessAtoll')} className="border-brandOrange focus:ring-brandOrange" style={{ backgroundColor: '#FFFFFF', color: '#333333' }} />
            </div>
            <div>
              <Label htmlFor="businessTelephone" className="text-brandBlack">Business Telephone</Label>
              <Input id="businessTelephone" {...register('businessTelephone')} className="border-brandOrange focus:ring-brandOrange" style={{ backgroundColor: '#FFFFFF', color: '#333333' }} />
            </div>
            <div>
              <Label htmlFor="location" className="text-brandBlack">Location</Label>
              <Input id="location" {...register('location')} className="border-brandOrange focus:ring-brandOrange" style={{ backgroundColor: '#FFFFFF', color: '#333333' }} />
            </div>
            <div>
              <Label htmlFor="storeDescription" className="text-brandBlack">Store Description</Label>
              <Input id="storeDescription" {...register('storeDescription')} className="border-brandOrange focus:ring-brandOrange" style={{ backgroundColor: '#FFFFFF', color: '#333333' }} />
            </div>
            <div>
              <Label htmlFor="url" className="text-brandBlack">Business URL</Label>
              <Input id="url" {...register('url')} className="border-brandOrange focus:ring-brandOrange" style={{ backgroundColor: '#FFFFFF', color: '#333333' }} />
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="avatarImage" className="text-brandBlack">Avatar Image</Label>
            {userData.avatarImageUrl && !isAvatarCropping ? (
              <div className="mb-2">
                <img src={userData.avatarImageUrl} alt="Avatar" className="w-16 h-16 object-cover rounded-full" />
                <Button onClick={() => handleRemoveImage('avatar')} className="mt-2 text-xs" style={{ backgroundColor: '#FF8400', color: '#FFFFFF' }}>
                  Remove Avatar
                </Button>
              </div>
            ) : (
              <>
                <Input
                  id="avatarImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange(setSelectedAvatar, setIsAvatarCropping)}
                  className="border-brandOrange focus:ring-brandOrange"
                  style={{ backgroundColor: '#FFFFFF', color: '#333333' }}
                />
                {selectedAvatar && isAvatarCropping && (
                  <ImageCropper
                    imageSrc={selectedAvatar}
                    aspectRatio={1}
                    onCropComplete={handleCropComplete(setCroppedAvatar, setIsAvatarCropping)}
                  />
                )}
                {croppedAvatar && !isAvatarCropping && (
                  <div className="mt-4">
                    <img
                      src={URL.createObjectURL(croppedAvatar)}
                      alt="Cropped Avatar"
                      className="w-16 h-16 object-cover mt-2 rounded-full"
                    />
                    <Button onClick={() => setCroppedAvatar(null)} className="mt-2 text-xs" style={{ backgroundColor: '#FF8400', color: '#FFFFFF' }}>
                      Remove Image
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mb-4">
            <Label htmlFor="bannerImage" className="text-brandBlack">Banner Image</Label>
            {userData.bannerImageUrl && !isBannerCropping ? (
              <div className="mb-2">
                <img src={userData.bannerImageUrl} alt="Banner" className="w-full h-32 object-cover rounded-md" />
                <Button onClick={() => handleRemoveImage('banner')} className="mt-2 text-xs" style={{ backgroundColor: '#FF8400', color: '#FFFFFF' }}>
                  Remove Banner
                </Button>
              </div>
            ) : (
              <>
                <Input
                  id="bannerImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange(setSelectedBanner, setIsBannerCropping)}
                  className="border-brandOrange focus:ring-brandOrange"
                  style={{ backgroundColor: '#FFFFFF', color: '#333333' }}
                />
                {selectedBanner && isBannerCropping && (
                  <ImageCropper
                    imageSrc={selectedBanner}
                    aspectRatio={2}
                    onCropComplete={handleCropComplete(setCroppedBanner, setIsBannerCropping)}
                  />
                )}
                {croppedBanner && !isBannerCropping && (
                  <div className="mt-4">
                    <img
                      src={URL.createObjectURL(croppedBanner)}
                      alt="Cropped Banner"
                      className="w-full h-32 object-cover mt-2 rounded-md"
                    />
                    <Button onClick={() => setCroppedBanner(null)} className="mt-2 text-xs" style={{ backgroundColor: '#FF8400', color: '#FFFFFF' }}>
                      Remove Image
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="links.instagram" style={{ color: '#333333' }}>Instagram URL</Label>
              <Input id="links.instagram" {...register('links.instagram')} className="border-brandOrange focus:ring-brandOrange" style={{ backgroundColor: '#FFFFFF', color: '#333333' }} />
            </div>
            <div>
              <Label htmlFor="links.viber" style={{ color: '#333333' }}>Viber URL</Label>
              <Input id="links.viber" {...register('links.viber')} className="border-brandOrange focus:ring-brandOrange" style={{ backgroundColor: '#FFFFFF', color: '#333333' }} />
            </div>
            <div>
              <Label htmlFor="links.map" style={{ color: '#333333' }}>Map URL</Label>
              <Input id="links.map" {...register('links.map')} className="border-brandOrange focus:ring-brandOrange" style={{ backgroundColor: '#FFFFFF', color: '#333333' }} />
            </div>
            <div>
              <Label htmlFor="links.telegram" style={{ color: '#333333' }}>Telegram URL</Label>
              <Input id="links.telegram" {...register('links.telegram')} className="border-brandOrange focus:ring-brandOrange" style={{ backgroundColor: '#FFFFFF', color: '#333333' }} />
            </div>
            <div>
              <Label htmlFor="links.facebook" style={{ color: '#333333' }}>Facebook URL</Label>
              <Input id="links.facebook" {...register('links.facebook')} className="border-brandOrange focus:ring-brandOrange" style={{ backgroundColor: '#FFFFFF', color: '#333333' }} />
            </div>
            <div>
              <Label htmlFor="links.whatsapp" style={{ color: '#333333' }}>WhatsApp URL</Label>
              <Input id="links.whatsapp" {...register('links.whatsapp')} className="border-brandOrange focus:ring-brandOrange" style={{ backgroundColor: '#FFFFFF', color: '#333333' }} />
            </div>
            <div>
              <Label htmlFor="links.twitter" style={{ color: '#333333' }}>Twitter URL</Label>
              <Input id="links.twitter" {...register('links.twitter')} className="border-brandOrange focus:ring-brandOrange" style={{ backgroundColor: '#FFFFFF', color: '#333333' }} />
            </div>
          </div>

          {isChanged && (
            <div className="flex justify-end space-x-2">
              <Button type="submit" className="w-full sm:w-auto" style={{ backgroundColor: '#FF8400', color: '#FFFFFF' }} disabled={isAvatarCropping || isBannerCropping || isSubmitting}>
                {isSubmitting ? <Spinner /> : 'Save'}
              </Button>
              <Button onClick={handleCancel} className="w-full sm:w-auto" style={{ backgroundColor: '#FFB84D', color: '#333333' }}>
                Cancel
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserDetails;
