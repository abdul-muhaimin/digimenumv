#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import chalk from 'chalk';
import inquirer from 'inquirer';

const prisma = new PrismaClient();

async function main() {
  console.log(chalk.blue('Fetching user details...'));

  const users = await prisma.user.findMany({
    include: {
      menus: {
        include: {
          categories: {
            include: {
              products: true,
            },
          },
        },
      },
    },
  });

  if (users.length === 0) {
    console.log(chalk.red('No users found.'));
    return;
  }

  const userChoices = users.map((user) => ({
    name: user.name || user.email || `User ${user.id}`,
    value: user.id,
  }));

  const { userId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'userId',
      message: 'Select a user to view details:',
      choices: userChoices,
    },
  ]);

  const user = users.find((u) => u.id === userId);

  if (!user) {
    console.log(chalk.red('User not found.'));
    return;
  }

  console.log(chalk.green.bold(`\nUser Details:`));
  console.log(chalk.yellow(`Name: ${user.name}`));
  console.log(chalk.yellow(`Email: ${user.email}`));
  console.log(chalk.yellow(`Mobile: ${user.mobile}`));
  console.log(chalk.yellow(`Business Name: ${user.businessName}`));
  console.log(chalk.yellow(`Business Type: ${user.businessType}`));
  console.log(chalk.yellow(`Business Address: ${user.businessAddress}`));
  console.log(chalk.yellow(`Business Island: ${user.businessIsland}`));
  console.log(chalk.yellow(`Business Atoll: ${user.businessAtoll}`));
  console.log(chalk.yellow(`Business Telephone: ${user.businessTelephone}`));

  if (user.menus.length === 0) {
    console.log(chalk.red('\nNo menus found for this user.'));
  } else {
    console.log(chalk.green.bold(`\nMenus:`));
    user.menus.forEach((menu) => {
      console.log(chalk.cyan(`\n  Menu: ${menu.name} (Position: ${menu.position})`));

      if (menu.categories.length === 0) {
        console.log(chalk.red('    No categories found for this menu.'));
      } else {
        console.log(chalk.magenta.bold(`    Categories:`));
        menu.categories.forEach((category) => {
          console.log(chalk.blue(`      Category: ${category.name} (Position: ${category.position})`));

          if (category.products.length === 0) {
            console.log(chalk.red('        No products found for this category.'));
          } else {
            console.log(chalk.green.bold(`        Products:`));
            category.products.forEach((product) => {
              console.log(chalk.white(`          Product: ${product.name} (Position: ${product.position})`));
              console.log(chalk.white(`            Price: ${product.price}`));
              console.log(chalk.white(`            Description: ${product.description}`));
              console.log(chalk.white(`            Image URL: ${product.imageUrl}`));
            });
          }
        });
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(chalk.red(e));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
