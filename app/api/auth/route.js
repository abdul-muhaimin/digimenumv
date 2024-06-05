import { PrismaClient } from '@prisma/client';
import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    console.log('User ID from Clerk:', userId);

    const user = await currentUser();
    const clerkId = user.id;
    const email = user.emailAddresses?.[0]?.emailAddress || "null";
    const mobile = user.phoneNumbers?.[0]?.phoneNumber || "null";

    console.log('Received request with Clerk ID:', clerkId, 'email:', email, 'mobile:', mobile);

    // Check if the user exists in the users table
    const existingUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!existingUser) {
      // User does not exist, insert the user with email and mobile number
      const newUser = await prisma.user.create({
        data: {
          clerkId,
          email,
          mobile,
        },
      });
      console.log('New user created:', newUser);
    } else {
      console.log('User already exists:', existingUser);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to check or create user:', error);
    return NextResponse.json({ error: 'Failed to check or create user', details: error.message }, { status: 500 });
  }
}
