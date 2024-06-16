import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Get total products
    const totalProducts = await prisma.product.count();

    // Get total menus
    const totalMenus = await prisma.menu.count();

    // Get total products with discounts
    const productsWithDiscount = await prisma.product.count({
      where: {
        OR: [
          { discountPercentage: { not: null } },
          { discountFixed: { not: null } }
        ]
      }
    });

    // Get total disabled products
    const disabledProducts = await prisma.product.count({
      where: {
        active: 0
      }
    });

    return new Response(JSON.stringify({
      totalProducts,
      totalMenus,
      productsWithDiscount,
      disabledProducts
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
