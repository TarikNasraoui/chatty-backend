import Logger from 'bunyan';
import { BaseCache } from '@service/redis/base.cache';
import { config } from '@root/config';

const log: Logger = config.createLogger('redisConnection');

class RedisConnection extends BaseCache {
  constructor() {
    super('redisConnection');
  }

  async connect() {
    try {
      await this.client.connect();
      const res = await this.client.ping();
      console.log('res', res);
    } catch (error) {
      log.error(error);
    }
  }
}

export const redisConnection: RedisConnection = new RedisConnection();
