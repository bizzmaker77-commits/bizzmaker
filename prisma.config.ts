import 'dotenv/config';
import { definePrismaConfig } from 'prisma/config';
import { defineConfig, prisma7Schema } from '@prisma/orm-postgres/config';
import { defineConfig as composer } from '@prisma/composer/config';
import { nodeBuild } from '@prisma/composer/node/control';
import { nextjsBuild } from '@prisma/composer/nextjs/control';
import { prismaCloud, prismaState } from '@prisma/composer-prisma-cloud/control';

export default definePrismaConfig({
  orm: defineConfig({
    contract: prisma7Schema('prisma/schema.prisma'),
    output: 'src/prisma',
    db: {
      connection: process.env.DATABASE_URL || '',
    },
  }),
  composer: composer({
    entry: './module.mjs',
    extensions: [prismaCloud(), nodeBuild(), nextjsBuild()],
    state: prismaState(),
  }),
});
