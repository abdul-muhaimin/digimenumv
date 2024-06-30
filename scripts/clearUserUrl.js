// clearUserUrl.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearUserUrl() {
  try {
    const result = await prisma.user.updateMany({
      where: { clerkId: 'user_2iXrKED6wOxx3QTuIGSIwCIwZKX' },
      data: { url: null },
    });

    console.log('URL cleared for user:', result);
  } catch (error) {
    console.error('Error clearing URL:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearUserUrl();
