import dotenv from 'dotenv';
dotenv.config();

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env variable: ${key}`);
  return val;
}

export const config = {
  port: parseInt(process.env.PORT ?? '5000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isDev: (process.env.NODE_ENV ?? 'development') === 'development',
  mongoUri: required('MONGODB_URI'),
  redisUrl: required('REDIS_URL'),
  geminiApiKey: required('GEMINI_API_KEY'),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  uploadDir: process.env.UPLOAD_DIR ?? 'uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE ?? '10485760', 10), 
  queues: {
    assessment: 'assessment-generation',
  },
  jobTtl: 60 * 60 * 24, 
} as const;