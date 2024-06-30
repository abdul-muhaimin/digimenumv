import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

export async function POST(req) {
  const { userId } = auth(req);

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { userUrl } = await req.json();
  const fullUrl = `http://localhost:3000/${userUrl}`;

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(fullUrl);

    // Save QR code URL to the database
    const user = await prisma.user.update({
      where: { id: userId },
      data: { qrCodeUrl: qrCodeDataUrl },
    });

    return new Response(JSON.stringify({ qrCodeDataUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
