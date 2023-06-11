import 'module-alias/register';

import { buildServer } from '@/utils/server';

async function main() {
  const app = await buildServer();

  app.listen({
    port: 3000,
    host: '0.0.0.0',
  });
}

main();
