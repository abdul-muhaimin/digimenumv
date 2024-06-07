import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  const { categoryId } = params;
  let data;

  try {
    data = await req.json();
  } catch (error) {
    console.error('Invalid request body:', error);
    return new Response(JSON.stringify({ message: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { name, price, description } = data;

  try {
    console.log('Finding last product in category:', categoryId);
    const lastProduct = await prisma.product.findFirst({
      where: { categoryId: parseInt(categoryId) },
      orderBy: { position: 'desc' },
    });

    const newPosition = lastProduct ? lastProduct.position + 1 : 0;
    console.log('New product position:', newPosition);

    console.log('Creating product with data:', { name, price, description, categoryId: parseInt(categoryId), position: newPosition });
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        categoryId: parseInt(categoryId),
        position: newPosition,
      },
    });

    console.log('Product created successfully:', product);
    return new Response(JSON.stringify(product), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(req, { params }) {
  const { userId } = auth(req);

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { categoryId } = params;
  const { id, name, price, description } = await req.json();

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: parseFloat(price),
        description,
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

  const { categoryId } = params;
  const { id } = await req.json();

  try {
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return new Response(JSON.stringify({ message: 'Product deleted' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
