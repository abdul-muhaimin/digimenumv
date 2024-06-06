const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      menus: true,
    },
  });

  for (const user of users) {
    let position = 0;
    for (const menu of user.menus) {
      await prisma.menu.update({
        where: { id: menu.id },
        data: { position: position },
      });
      position++;
    }
  }
}

main()
  .then(() => {
    console.log('Positions reset successfully.');
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
