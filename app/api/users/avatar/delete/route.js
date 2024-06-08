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

  const { imageUrl } = await req.json();

  if (!imageUrl) {
    return new Response(JSON.stringify({ message: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract publicId from imageUrl

  try {
    // Delete the image from Cloudinary
    await cloudinary.v2.uploader.destroy(publicId);

    // Remove the image URL from the user record in the database
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: { avatarImageUrl: null },
    });

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting avatar image:', error);
    return new Response(JSON.stringify({ message: 'Failed to delete avatar image', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
