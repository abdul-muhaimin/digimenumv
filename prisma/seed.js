const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.business.create({
    data: {
      name: 'Example Business',
      type: 'Cafe',
      address: '123 Main St',
      island: 'Island Name',
      atoll: 'Atoll Name',
      telephone: '1234567890',
      userId: 'user_2hSkc2hEoavyRU1X1vU9dzEJPLA', // Replace with the actual userId
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
