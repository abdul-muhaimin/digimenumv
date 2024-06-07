const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateProductPositions() {
  const categories = await prisma.category.findMany({
    include: {
      products: true,
    },
  });

  for (const category of categories) {
    const { products } = category;
    for (let i = 0; i < products.length; i++) {
      await prisma.product.update({
        where: { id: products[i].id },
        data: { position: i },
      });
    }
  }

  console.log('Product positions updated successfully.');
  prisma.$disconnect();
}

updateProductPositions().catch((error) => {
  console.error('Error updating product positions:', error);
  prisma.$disconnect();
});
updateProductPositions();
