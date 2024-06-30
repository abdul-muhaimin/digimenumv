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
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            category: {
              menu: {
                user: {
                  clerkId: userId,
                },
              },
            },
          },
          {
            menu: {
              user: {
                clerkId: userId,
              },
            },
          },
        ],
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        menu: {
          select: {
            name: true,
          },
        },
      },
    });
    return new Response(JSON.stringify(products), {
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

export async function POST(req) {
  const { userId } = auth(req);

  if (!userId) {
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

  const { name, price, description, imageUrl, categoryId, menuId } = data;

  if (!categoryId && !menuId) {
    return new Response(JSON.stringify({ message: 'Either categoryId or menuId is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        imageUrl,
        categoryId: categoryId || null,
        menuId: menuId || null,
      },
    });
    return new Response(JSON.stringify(newProduct), {
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

export async function PUT(req) {
  const { userId } = auth(req);

  if (!userId) {
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

  const { products } = data;

  try {
    await prisma.$transaction(
      products.map((product) =>
        prisma.product.update({
          where: { id: product.id },
          data: {
            name: product.name,
            price: parseFloat(product.price),
            description: product.description,
            imageUrl: product.imageUrl,
            categoryId: product.categoryId,
            menuId: product.menuId,
          },
        })
      )
    );
    return new Response(JSON.stringify({ message: 'Products updated successfully' }), {
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
