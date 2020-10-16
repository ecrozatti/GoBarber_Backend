import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';
import AppError from '@shared/errors/AppError';

const redisClient = redis.createClient({
   host: process.env.REDIS_HOST,
   port: Number(process.env.REDIS_PORT),
   password: process.env.REDIS_PASS || undefined,
});

const limiter = new RateLimiterRedis({
   storeClient: redisClient,
   keyPrefix: 'ratelimit',
   points: 5,     // 5 requisições
   duration: 1,   // por 1 seg. por IP
   // blockDuration:  // daria para aplicar tempo de bloqueio apos n. maximo de tentativas
});

export default async function rateLimiter(
   request: Request,
   response: Response,
   next: NextFunction
): Promise<void> {
   try {
      await limiter.consume(request.ip);
      return next();
   } catch (err) {
      throw new AppError('Too many requests', 429);
   }
}
