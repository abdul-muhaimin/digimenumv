import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET(req) {
  const { userId } = auth(req);

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        mobile: true,
        name: true,
        createdAt: true,
        businessName: true,
        businessType: true,
        businessAddress: true,
        businessIsland: true,
        businessAtoll: true,
        businessTelephone: true,
        bannerImageUrl: true,
        avatarImageUrl: true,
        location: true,
        links: true,
        storeDescription: true,
      },
    });

    if (user) {
      return new Response(JSON.stringify(user), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(req) {
  const { userId } = auth(req);
  let data;

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    data = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const {
    name, email, mobile,
    businessName, businessType, businessAddress,
    businessIsland, businessAtoll, businessTelephone, avatarImageUrl, bannerImageUrl, links, location, storeDescription
  } = data;

  try {
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        name, email, mobile,
        businessName, businessType, businessAddress,
        businessIsland, businessAtoll, businessTelephone, avatarImageUrl, bannerImageUrl, links, location, storeDescription
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
