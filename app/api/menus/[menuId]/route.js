import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { userId } = auth(req);
  const { menuId } = params;

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(menuId) },
      include: {
        categories: {
          include: {
            products: true,
          },
        },
      },
    });

    const productsWithoutCategory = await prisma.product.findMany({
      where: {
        menuId: parseInt(menuId),
        categoryId: null,
      },
    });

    if (menu) {
      return new Response(JSON.stringify({ ...menu, productsWithoutCategory }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ message: 'Menu not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// PUT and DELETE handlers would be similarly defined here...


export async function PUT(req, { params }) {
  const { userId } = auth(req);
  const { menuId } = params;
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

  const { name } = data;

  try {
    const updatedMenu = await prisma.menu.update({
      where: { id: parseInt(menuId) },
      data: { name },
    });

    return new Response(JSON.stringify(updatedMenu), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req, { params }) {
  const { userId } = auth(req);
  const { menuId } = params;

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await prisma.menu.delete({
      where: { id: parseInt(menuId) },
    });

    return new Response(JSON.stringify({ message: 'Menu deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
