// /app/api/products/[productId]/clear-image.js
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  const { userId } = auth(req);
  const { productId } = params;

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(productId) },
      data: { imageUrl: '' },
    });

    return new Response(JSON.stringify(updatedProduct), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to update product', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
