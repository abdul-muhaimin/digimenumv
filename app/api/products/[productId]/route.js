import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  const { userId } = auth(req);

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { productId } = params;
  const {
    name,
    price,
    description,
    active,
    soldOut,
    discountPercentage,
    discountFixed,
    likes,
    notice,
    allergyCodes
  } = await req.json();

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(productId) },
      data: {
        name,
        price: parseFloat(price),
        description,
        active: parseInt(active),  // Make sure to convert these fields to integers
        soldOut: parseInt(soldOut),  // Make sure to convert these fields to integers
        discountPercentage: discountPercentage ? parseFloat(discountPercentage) : null,
        discountFixed: discountFixed ? parseFloat(discountFixed) : null,
        likes: parseInt(likes),  // Convert likes to integer
        notice,
        allergyCodes: Array.isArray(allergyCodes) ? allergyCodes.map(Number) : [],  // Ensure allergyCodes is an array of numbers
      },
    });

    return new Response(JSON.stringify(updatedProduct), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req, { params }) {
  const { userId } = auth(req);

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { productId } = params;

  try {
    await prisma.product.delete({
      where: { id: parseInt(productId) },
    });

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
