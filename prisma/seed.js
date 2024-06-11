const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker'); // Use @faker-js/faker
const prisma = new PrismaClient();

const clerkId = 'user_2hZzw4oNBxvVnePM9nWFAOqRjfm';

async function main() {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      menus: {
        include: {
          categories: {
            include: {
              products: {
                orderBy: {
                  position: 'asc'
                }
              }
            }
          }
        }
      }
    }
  });

  if (!user) {
    console.log('User not found');
    return;
  }

  for (const menu of user.menus) {
    for (const category of menu.categories) {
      let startPosition = category.products.length > 0 ? category.products[category.products.length - 1].position + 1 : 0;

      for (let i = 0; i < 5; i++) {
        await prisma.product.create({
          data: {
            name: faker.commerce.productName(),
            price: parseFloat(faker.commerce.price()),
            description: faker.lorem.paragraph(),
            categoryId: category.id,
            imageUrl: '/placeholder.png', // or any other placeholder image URL
            position: startPosition++
          }
        });
      }
    }
  }

  console.log('Seeding completed');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
