import { setupServer } from './server';
import config from './config';

let app: any;

async function run() {
  app = await setupServer(); // Inisialisasi server
  app.listen(config.port, () => {
    console.log(`
    ==========================================
          Server is running on port ${config.port}
    ==========================================
    `);
  });
}

run();

export { app };
