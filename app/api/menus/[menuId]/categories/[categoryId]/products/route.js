import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

// Handle GET request to fetch all products for a category
export async function GET(req) {
  const { categoryId } = req.query;

  try {
    const products = await prisma.product.findMany({
      where: { categoryId: parseInt(categoryId) },
      orderBy: { position: 'asc' },
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

// Handle POST request to create a new product
export async function POST(req) {
  const { categoryId } = req.query;
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
    console.log('Fetching last product for category ID:', categoryId);

    const lastProduct = await prisma.product.findFirst({
      where: { categoryId: parseInt(categoryId) },
      orderBy: { position: 'desc' },
    });

    console.log('Last product:', lastProduct);

    const newPosition = lastProduct ? lastProduct.position + 1 : 0;

    console.log('Computed new position:', newPosition);

    if (typeof newPosition !== 'number' || isNaN(newPosition)) {
      console.error('Invalid position value:', newPosition);
      throw new Error('Invalid position value');
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        categoryId: parseInt(categoryId),
        position: newPosition,
      },
    });

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

// Handle PUT request to reorder products
export async function PUT(req, { params }) {
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

  const { categoryId } = params;
  const { products } = data;

  try {
    for (let i = 0; i < products.length; i++) {
      await prisma.product.update({
        where: { id: products[i].id },
        data: { position: i },
      });
    }

    return new Response(JSON.stringify({ message: 'Products reordered successfully' }), {
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
