const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seed = async () => {
  const now = new Date();

  // Seed URL visits for the past 7 days
  for (let i = 0; i < 7; i++) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);

    // Generate a random number of visits for the day (between 5 and 20)
    const visitCount = Math.floor(Math.random() * 16) + 5;

    for (let j = 0; j < visitCount; j++) {
      const randomHour = Math.floor(Math.random() * 24);
      const randomMinute = Math.floor(Math.random() * 60);
      const randomSecond = Math.floor(Math.random() * 60);

      const visitTime = new Date(day);
      visitTime.setHours(randomHour);
      visitTime.setMinutes(randomMinute);
      visitTime.setSeconds(randomSecond);

      await prisma.uRLVisit.create({
        data: {
          storeId: 'user_2hZzw4oNBxvVnePM9nWFAOqRjfm',
          timestamp: visitTime,
        },
      });
    }
  }

  console.log('Realistic URL visits have been seeded');
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
