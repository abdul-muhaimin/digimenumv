import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

// Handle POST request to create a new category
export async function POST(req, { params }) {
  const { userId: clerkUserId } = auth(req);

  if (!clerkUserId) {
    return new Response(JSON.stringify({ message: 'Authentication required' }), {
      status: 401,
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

  const { menuId } = params;
  const { name } = data;

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const lastCategory = await prisma.category.findFirst({
      where: { menuId: parseInt(menuId) },
      orderBy: { position: 'desc' },
    });

    const newPosition = lastCategory ? lastCategory.position + 1 : 0;

    const category = await prisma.category.create({
      data: {
        name,
        menuId: parseInt(menuId),
        position: newPosition,
      },
    });

    return new Response(JSON.stringify(category), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
