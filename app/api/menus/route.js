import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET(req) {
  const { userId: clerkUserId } = auth(req);

  if (!clerkUserId) {
    return new Response(JSON.stringify({ message: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

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

    const menus = await prisma.menu.findMany({
      where: { userId: user.id },
      orderBy: { position: 'asc' },
      include: {
        categories: {
          select: {
            _count: {
              select: { products: true },
            },
          },
        },
      },
    });

    const menuData = menus.map(menu => ({
      ...menu,
      categoriesCount: menu.categories.length,
      productsCount: menu.categories.reduce((acc, category) => acc + category._count.products, 0),
    }));

    return new Response(JSON.stringify(menuData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching menus:', error);
    return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


// Handle POST request to create a new menu
export async function POST(req) {
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

    const lastMenu = await prisma.menu.findFirst({
      where: { userId: user.id },
      orderBy: { position: 'desc' },
    });

    const newPosition = lastMenu ? lastMenu.position + 1 : 0;

    const menu = await prisma.menu.create({
      data: {
        name,
        userId: user.id,
        position: newPosition,
      },
    });

    return new Response(JSON.stringify(menu), {
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
