import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import getCroppedImg from '@/utils/cropImage'; // Utility function for processing the cropped image

const ImageCropper = ({ imageSrc, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteInternal = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      console.log('Image Source:', imageSrc);
      console.log('Cropped Area Pixels:', croppedAreaPixels);

      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      console.log('Cropped Image:', croppedImage);

      onCropComplete(croppedImage);
    } catch (e) {
      console.error('Error cropping image:', e);
    }
  }, [imageSrc, croppedAreaPixels, onCropComplete]);

  return (
    <div className="relative w-full h-64 bg-gray-200">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropCompleteInternal}
      />
      <Button onClick={showCroppedImage} className="absolute bottom-4 left-4">
        Crop Image
      </Button>
    </div>
  );
};

export default ImageCropper;
