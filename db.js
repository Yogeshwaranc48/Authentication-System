import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env.js';

let memoryServer = null;

const attachConnectionHandlers = () => {
  mongoose.connection.on('disconnected', () => {
    if (mongoose.connection.readyState === 0) {
      console.warn('MongoDB disconnected');
    }
  });

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB runtime error:', error.message);
  });
};

const connectWithUri = async (uri) => {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
};

export const connectDB = async () => {
  try {
    await connectWithUri(env.mongodbUri);
    attachConnectionHandlers();
    console.log(`MongoDB connected successfully (${env.mongodbUri})`);
    return;
  } catch (error) {
    console.warn(`MongoDB connection failed: ${error.message}`);
  }

  if (env.allowMemoryDbFallback) {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }

      console.warn('Starting in-memory MongoDB for local development...');
      memoryServer = await MongoMemoryServer.create();
      const memoryUri = memoryServer.getUri();

      await connectWithUri(memoryUri);
      attachConnectionHandlers();
      console.log(`In-memory MongoDB connected successfully (${memoryUri})`);
      return;
    } catch (memoryError) {
      console.error('In-memory MongoDB startup failed:', memoryError.message);
    }
  }

  console.error(
    'Unable to connect to MongoDB. Start MongoDB locally or set MONGODB_URI to a reachable instance.'
  );
  process.exit(1);
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};
