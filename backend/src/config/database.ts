import mongoose from 'mongoose';
import { config } from '.';

export async function connectMongoDB(): Promise<void> {
  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () =>
    console.warn('⚠️  MongoDB disconnected')
  );
  mongoose.connection.on('reconnected', () =>
    console.log('✅ MongoDB reconnected')
  );
}