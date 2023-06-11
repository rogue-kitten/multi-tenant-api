import 'dotenv/config';
import 'module-alias/register';

import { db } from '@/db/index';
import { buildServer } from '@/utils/server';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

async function main() {
  const app = await buildServer();

  await app.listen({
    port: 3000,
    host: '0.0.0.0',
  });
  /**
   * connecting the drizzle migrations to the db
   */
  await migrate(db, { migrationsFolder: './migrations' });
}

main();
