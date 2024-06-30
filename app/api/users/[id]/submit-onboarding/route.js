import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';
import QRCode from 'qrcode';

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

  try {
    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(`https://digimenumv.vercel.app/${url}`);

    // Update the user with the provided data and the QR code URL
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
        qrCodeUrl, // Save the generated QR code URL
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
