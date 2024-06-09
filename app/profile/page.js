"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageCropper from '@/components/ImageCropper';
import Navbar from '@/components/layout/SideBar';

const UserDetails = () => {
  const { isLoaded, user } = useUser();
  const [userData, setUserData] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [croppedAvatar, setCroppedAvatar] = useState(null);
  const [croppedBanner, setCroppedBanner] = useState(null);
  const [isAvatarCropping, setIsAvatarCropping] = useState(false);
  const [isBannerCropping, setIsBannerCropping] = useState(false);
  const { register, handleSubmit, setValue, control, reset } = useForm();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${user.id}`);
        if (!response.ok) throw new Error('Error fetching user data');
        const data = await response.json();
        setUserData(data);
        setValue('name', data.name);
        setValue('email', data.email);
        setValue('mobile', data.mobile);
        setValue('businessName', data.businessName);
        setValue('businessType', data.businessType);
        setValue('businessAddress', data.businessAddress);
        setValue('businessIsland', data.businessIsland);
        setValue('businessAtoll', data.businessAtoll);
        setValue('businessTelephone', data.businessTelephone);
        setValue('location', data.location);
        setValue('storeDescription', data.storeDescription);
        setValue('links.instagram', data.links?.instagram);
        setValue('links.viber', data.links?.viber);
        setValue('links.map', data.links?.map);
        setValue('links.telegram', data.links?.telegram);
        setValue('links.facebook', data.links?.facebook);
        setValue('links.whatsapp', data.links?.whatsapp);
        setValue('links.twitter', data.links?.twitter);
      } catch (error) {
        toast.error('Failed to fetch user data');
      }
    };

    fetchUserData();
  }, [isLoaded, user, setValue]);

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
      setUserData(updatedData);
      toast.success('Details updated successfully');
    } catch (error) {
      toast.error('Failed to update user data');
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

  if (!userData) return <div>Loading...</div>;

  return (
    <div>

      <div className="container mx-auto p-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register('name')} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" {...register('email')} />
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile</Label>
                  <Input id="mobile" {...register('mobile')} />
                </div>
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" {...register('businessName')} />
                </div>
                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input id="businessType" {...register('businessType')} />
                </div>
                <div>
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Input id="businessAddress" {...register('businessAddress')} />
                </div>
                <div>
                  <Label htmlFor="businessIsland">Business Island</Label>
                  <Input id="businessIsland" {...register('businessIsland')} />
                </div>
                <div>
                  <Label htmlFor="businessAtoll">Business Atoll</Label>
                  <Input id="businessAtoll" {...register('businessAtoll')} />
                </div>
                <div>
                  <Label htmlFor="businessTelephone">Business Telephone</Label>
                  <Input id="businessTelephone" {...register('businessTelephone')} />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" {...register('location')} />
                </div>
                <div>
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Input id="storeDescription" {...register('storeDescription')} />
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="avatarImage">Avatar Image</Label>
                {userData.avatarImageUrl && !isAvatarCropping && (
                  <div className="mb-2">
                    <img src={userData.avatarImageUrl} alt="Avatar" className="w-16 h-16 object-cover rounded-full" />
                    <Button onClick={() => handleRemoveImage('avatar')} className="mt-2 text-xs">
                      Remove Avatar
                    </Button>
                  </div>
                )}
                {!userData.avatarImageUrl && !selectedAvatar && (
                  <Input
                    id="avatarImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange(setSelectedAvatar, setIsAvatarCropping)}
                  />
                )}
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
                    <Button onClick={() => setCroppedAvatar(null)} className="mt-2 text-xs">
                      Remove Image
                    </Button>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <Label htmlFor="bannerImage">Banner Image</Label>
                {userData.bannerImageUrl && !isBannerCropping && (
                  <div className="mb-2">
                    <img src={userData.bannerImageUrl} alt="Banner" className="w-full h-32 object-cover rounded-md" />
                    <Button onClick={() => handleRemoveImage('banner')} className="mt-2 text-xs">
                      Remove Banner
                    </Button>
                  </div>
                )}
                {!userData.bannerImageUrl && !selectedBanner && (
                  <Input
                    id="bannerImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange(setSelectedBanner, setIsBannerCropping)}
                  />
                )}
                {selectedBanner && isBannerCropping && (
                  <ImageCropper
                    imageSrc={selectedBanner}
                    aspectRatio={100 / 50}
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
                    <Button onClick={() => setCroppedBanner(null)} className="mt-2 text-xs">
                      Remove Image
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="links.instagram">Instagram URL</Label>
                  <Input id="links.instagram" {...register('links.instagram')} />
                </div>
                <div>
                  <Label htmlFor="links.viber">Viber URL</Label>
                  <Input id="links.viber" {...register('links.viber')} />
                </div>
                <div>
                  <Label htmlFor="links.map">Map URL</Label>
                  <Input id="links.map" {...register('links.map')} />
                </div>
                <div>
                  <Label htmlFor="links.telegram">Telegram URL</Label>
                  <Input id="links.telegram" {...register('links.telegram')} />
                </div>
                <div>
                  <Label htmlFor="links.facebook">Facebook URL</Label>
                  <Input id="links.facebook" {...register('links.facebook')} />
                </div>
                <div>
                  <Label htmlFor="links.whatsapp">WhatsApp URL</Label>
                  <Input id="links.whatsapp" {...register('links.whatsapp')} />
                </div>
                <div>
                  <Label htmlFor="links.twitter">Twitter URL</Label>
                  <Input id="links.twitter" {...register('links.twitter')} />
                </div>
              </div>

              {isChanged && (
                <div className="flex justify-end space-x-2">
                  <Button type="submit" className="w-full sm:w-auto" disabled={isAvatarCropping || isBannerCropping}>
                    Save
                  </Button>
                  <Button onClick={handleCancel} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetails;
