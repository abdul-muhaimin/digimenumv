import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';
import { generateQrCode } from '@/utils/generateQrCode';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  const { userId } = auth(req);

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { id } = params;

  if (userId !== id) {
    return new Response(JSON.stringify({ message: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let data;

  try {
    data = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { name, businessName, businessType, businessAddress, businessIsland, businessAtoll, businessTelephone, url } = data;

  const qrCodeUrlPath = `/qrcodes/${url}.png`;
  const qrCodeFullPath = path.join(process.cwd(), 'public', qrCodeUrlPath);
  const qrCodeLink = `http://localhost:3000/${url}`;

  try {
    await generateQrCode(qrCodeLink, path.join(process.cwd(), 'public', 'sticker.png'), qrCodeFullPath);

    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        name,
        businessName,
        businessType,
        businessAddress,
        businessIsland,
        businessAtoll,
        businessTelephone,
        url,
        qrCodeUrl: qrCodeUrlPath,
      },
    });

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
