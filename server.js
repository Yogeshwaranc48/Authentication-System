import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { env } from './config/env.js';

let server = null;

const startServer = async () => {
  await connectDB();

  server = app.listen(env.port, () => {
    console.log(`Server running on port ${env.port} (${env.nodeEnv})`);
  });
};

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await disconnectDB();
  process.exit(0);
};

startServer();

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
