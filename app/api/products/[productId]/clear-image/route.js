import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req) {
  const { userId } = auth(req);

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(req.url);
  const productId = parseInt(url.pathname.split('/').slice(-2, -1)[0]); // Extract and parse productId from the URL

  const { publicId } = await req.json();

  if (isNaN(productId) || !publicId) {
    return new Response(JSON.stringify({ message: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Clear the image URL in the database
    await prisma.product.update({
      where: { id: productId },
      data: { imageUrl: '' },
    });

    return new Response(JSON.stringify({ message: 'Image deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to delete image', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
