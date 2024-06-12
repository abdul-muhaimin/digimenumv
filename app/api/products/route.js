import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET(req, res) {
  const { userId } = auth(req);

  if (!userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          menu: {
            user: {
              clerkId: userId, // Use clerkId instead of userId
            },
          },
        },
      },
      include: {
        category: {
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

export async function PUT(req) {
  const { userId } = auth();

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { products } = await req.json();

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
