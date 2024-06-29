import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import getCroppedImg from '@/utils/cropImage'; // Utility function for processing the cropped image

const ImageCropper = ({ imageSrc, onCropComplete, aspectRatio = 2 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteInternal = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error('Error cropping image:', e);
    }
  }, [imageSrc, croppedAreaPixels, onCropComplete]);

  return (
    <div className="relative w-full max-w-lg h-64 bg-gray-200">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={aspectRatio}
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
