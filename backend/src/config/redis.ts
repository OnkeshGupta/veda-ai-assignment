import Redis from 'ioredis';
import { config } from '.';

export const redis = new Redis(config.redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: config.redisUrl.startsWith('rediss://') ? {} : undefined,
});

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', (err) => console.error('❌ Redis error:', err));
redis.on('close', () => console.warn('⚠️  Redis connection closed'));

export const redisSub = new Redis(config.redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: config.redisUrl.startsWith('rediss://') ? {} : undefined,
});

const CACHE_PREFIX = 'veda:';

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const val = await redis.get(CACHE_PREFIX + key);
    return val ? (JSON.parse(val) as T) : null;
  } catch {
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSecs: number = 3600
): Promise<void> {
  try {
    await redis.set(CACHE_PREFIX + key, JSON.stringify(value), 'EX', ttlSecs);
  } catch {

  }
}

export async function cacheDel(key: string): Promise<void> {
  try {
    await redis.del(CACHE_PREFIX + key);
  } catch {

  }
}

export async function setJobState(
  jobId: string,
  state: object,
  ttlSecs: number = config.jobTtl
): Promise<void> {
  await redis.set(`job:${jobId}`, JSON.stringify(state), 'EX', ttlSecs);
}

export async function getJobState<T>(jobId: string): Promise<T | null> {
  const val = await redis.get(`job:${jobId}`);
  return val ? (JSON.parse(val) as T) : null;
}