// app/api/track-visit/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { storeId } = await req.json();

    await prisma.uRLVisit.create({
      data: {
        storeId: storeId, // Ensure storeId is a string
        timestamp: new Date(),
      },
    });

    return new NextResponse(JSON.stringify({ message: 'Visit tracked' }), { status: 201 });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error', details: error.message }), { status: 500 });
  }
}
