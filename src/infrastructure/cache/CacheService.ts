import Redis from 'ioredis';
import { autoInjectable, inject } from 'tsyringe';

@autoInjectable()
export class CacheService {
    constructor(@inject("RedisToken") private redis: Redis) {}

    async put(key: string, value: any, seconds?: number): Promise<void> {
        if (seconds) {
            await this.redis.set(key, JSON.stringify(value), 'EX', seconds);
        } else {
            await this.redis.set(key, JSON.stringify(value));
        }
    }

    async get<T>(key: string): Promise<T | null> {
        const data: string | null = await this.redis.get(key);
        return data ? JSON.parse(data) : null;
    }

    async has(key: string): Promise<boolean> {
        return Boolean(await this.redis.exists(key));
    }

    async forget(key: string): Promise<void> {
        await this.redis.del(key);
    }

    async flush(): Promise<void> {
        await this.redis.flushdb();
    }

    async remember<T>(key: string, seconds: number, fallback: () => Promise<T>): Promise<T> {
        const cachedValue = await this.get<T>(key);

        if (cachedValue !== null) {
            return cachedValue;
        }

        const fallbackValue = await fallback();
        await this.put(key, fallbackValue, seconds);
        return fallbackValue;
    }
}