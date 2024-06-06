import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

// Handle GET request to fetch all products for a category
export async function GET(req) {
  const { categoryId } = req.query;

  try {
    const products = await prisma.product.findMany({
      where: { categoryId: parseInt(categoryId) },
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
    return new Response(JSON.stringify({ message: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { name, price } = data;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
      },
    });

    return new Response(JSON.stringify(product), {
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
