import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';
import { startOfDay, endOfDay, subDays, subWeeks, subMonths, startOfWeek, startOfMonth } from 'date-fns';

const prisma = new PrismaClient();

export async function GET(req) {
  const { userId } = auth(req);
  const url = new URL(req.url);
  const timeFrame = url.searchParams.get('timeFrame') || 'daily';

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let startDate;
  let endDate = new Date();

  switch (timeFrame) {
    case 'daily':
      startDate = startOfDay(subDays(endDate, 1));
      break;
    case 'weekly':
      startDate = startOfWeek(subWeeks(endDate, 1));
      break;
    case 'monthly':
      startDate = startOfMonth(subMonths(endDate, 1));
      break;
    default:
      startDate = startOfDay(subDays(endDate, 1));
  }

  try {
    const visits = await prisma.uRLVisit.findMany({
      where: {
        storeId: userId,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { timestamp: 'asc' },
    });

    const todayStart = startOfDay(new Date());
    const yesterdayStart = startOfDay(subDays(new Date(), 1));
    const yesterdayEnd = endOfDay(subDays(new Date(), 1));

    const todayVisitors = await prisma.uRLVisit.count({
      where: {
        storeId: userId,
        timestamp: {
          gte: todayStart,
        },
      },
    });

    const yesterdayVisitors = await prisma.uRLVisit.count({
      where: {
        storeId: userId,
        timestamp: {
          gte: yesterdayStart,
          lte: yesterdayEnd,
        },
      },
    });

    const totalProducts = await prisma.product.count({
      where: { category: { menu: { user: { clerkId: userId } } } },
    });

    const totalMenus = await prisma.menu.count({
      where: { user: { clerkId: userId } },
    });

    const totalDiscounts = await prisma.product.count({
      where: {
        category: { menu: { user: { clerkId: userId } } },
        OR: [
          { discountPercentage: { not: null } },
          { discountFixed: { not: null } },
        ],
      },
    });

    const totalInactive = await prisma.product.count({
      where: {
        category: { menu: { user: { clerkId: userId } } },
        active: 0,
      },
    });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { qrCodeUrl: true },
    });

    return new Response(JSON.stringify({ visits, todayVisitors, yesterdayVisitors, totalProducts, totalMenus, totalDiscounts, totalInactive, qrCodeUrl: user.qrCodeUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
