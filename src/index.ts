import { setupServer } from './server';
import config from './config';

async function run() {
  const app = await setupServer();
  app.listen(config.port, () => {
    console.log(`
    ==========================================
          Server is running on port ${config.port}
    ==========================================
    `);
  });
}

run();
