import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

// Handle POST request to create a new product
export async function POST(req, { params }) {
  const { userId } = auth(req);
  const { menuId } = params;

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
    console.error('Invalid request body:', error);
    return new Response(JSON.stringify({ message: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { name, price, description, categoryId } = data;

  try {
    // Fetch the last item in the menu (either category or product without category)
    const lastCategory = await prisma.category.findFirst({
      where: { menuId: parseInt(menuId) },
      orderBy: { position: 'desc' },
    });

    const lastProduct = await prisma.product.findFirst({
      where: {
        menuId: parseInt(menuId),
        categoryId: null,
      },
      orderBy: { position: 'desc' },
    });

    // Determine the new position
    const lastPosition = Math.max(
      lastCategory ? lastCategory.position : -1,
      lastProduct ? lastProduct.position : -1
    );
    const newPosition = lastPosition + 1;

    const productData = {
      name,
      price: parseFloat(price),
      description,
      position: newPosition,
      menuId: parseInt(menuId),
    };

    if (categoryId) {
      productData.categoryId = parseInt(categoryId);
    }

    const product = await prisma.product.create({
      data: productData,
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

// Handle GET request to fetch all products for a menu
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
        productsWithoutCategory: true,
      },
    });

    if (menu) {
      return new Response(JSON.stringify(menu), {
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

// Handle PUT request to update a product
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

  const { id, name, price, description, categoryId } = data;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: parseFloat(price),
        description,
        categoryId: categoryId ? parseInt(categoryId) : null,
        menuId: categoryId ? null : parseInt(menuId),
      },
    });

    return new Response(JSON.stringify(updatedProduct), {
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

// Handle DELETE request to remove a product
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
    const { id } = await req.json();
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return new Response(JSON.stringify({ message: 'Product deleted successfully' }), {
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