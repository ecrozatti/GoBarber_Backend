import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';
import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    // Isso indica que o retorna eh exatamente o mesmo que usamor no recover()
    // Apenas JSON.parse(data) retornaria ANY.
    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
      // todas as chaves que comecam com esse prefixo
    const keys = await this.client.keys(`${prefix}:*`);

    // pipeline, quando queremos fazer multiplas operacoes ao mesmo tempo
    const pipeline = this.client.pipeline();

    // executa os deletes ao mesmo tempo com o pipeline
    keys.forEach(key => pipeline.del(key));

    await pipeline.exec();
  }
}
