import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';
import cloudinary from 'cloudinary';

const prisma = new PrismaClient();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  const { userId } = auth(req);

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const formData = await req.formData();
  const imageFile = formData.get('image');
  const productId = formData.get('productId');

  if (!imageFile || !productId) {
    return new Response(JSON.stringify({ message: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Convert the file to a buffer
    const buffer = Buffer.from(await imageFile.arrayBuffer());

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.v2.uploader.upload(`data:${imageFile.type};base64,${buffer.toString('base64')}`);

    const uploadedImageUrl = uploadResponse.secure_url;

    // Update product with image URL
    const product = await prisma.product.update({
      where: { id: parseInt(productId) },
      data: { imageUrl: uploadedImageUrl },
    });

    return new Response(JSON.stringify(product), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return new Response(JSON.stringify({ message: 'Failed to upload image to Cloudinary', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
