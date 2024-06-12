import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { businessName } = params;

  try {
    const user = await prisma.user.findFirst({
      where: { businessName },
      select: {
        id: true,
        clerkId: true,
        email: true,
        mobile: true,
        name: true,
        createdAt: true,
        businessName: true,
        businessType: true,
        businessAddress: true,
        businessIsland: true,
        businessAtoll: true,
        businessTelephone: true,
        bannerImageUrl: true,
        avatarImageUrl: true,
        location: true,
        links: true,
        storeDescription: true,
        menus: {
          select: {
            id: true,
            name: true,
            categories: {
              select: {
                id: true,
                name: true,
                products: {
                  where: { active: 1 }, // Only fetch active products
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    description: true,
                    imageUrl: true,
                    active: true,
                    soldOut: true,
                    discountPercentage: true,
                    discountFixed: true,
                    likes: true,
                    notice: true,
                    allergyCodes: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (user) {
      return new Response(JSON.stringify(user), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
