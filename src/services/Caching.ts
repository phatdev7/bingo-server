import redis, { RedisClient } from 'redis';
import config from '../../config';
const { redisUrl } = config.cachingConfig;

class Caching {
  redis: RedisClient;
  constructor() {
    this.redis = redis.createClient(redisUrl);

    this.redis.on('connect', () => {
      console.log('Redis connected');
    });

    this.redis.on('ready', () => {
      console.log('Redis ready');
    });

    this.redis.on('error', err => {
      console.log(`Redis error: ${err.message}`);
    });
  }

  expire = (key: string, expire: number) => {
    return new Promise((resolve, reject) => {
      this.redis.expire(key, expire, (err, res) => {
        if (err) return reject(err);
        return resolve(res > 0);
      });
    });
  };

  hset = (key: string, field: string, value: string, expire = 0) => {
    return new Promise((resolve, reject) => {
      this.redis.hset(key, field, value, async (err, res) => {
        if (err) return reject(err);
        if (expire === 0) return resolve(res > 0);
        const result = await this.expire(key, expire);
        return resolve(result);
      });
    });
  };

  hget = (key: string, field: string) => {
    return new Promise((resolve, reject) => {
      this.redis.hget(key, field, (err, res) => {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  };

  hmset = (
    key: string,
    fieldValues:
      | string
      | number
      | {
          [key: string]: string | number;
        }
      | (string | number)[],
    expire: number,
  ) => {
    return new Promise((resolve, reject) => {
      this.redis.hmset(key, fieldValues, async (err, res) => {
        if (err) return reject(err);
        if (expire === 0) return resolve(res === 'OK');
        const result = await this.expire(key, expire);
        return resolve(result);
      });
    });
  };

  hmget = (key: string, ...fields: string[]) => {
    return new Promise((resolve, reject) => {
      this.redis.hmget(key, fields, (err, res) => {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  };

  hgetall = (key: string) => {
    return new Promise((resolve, reject) => {
      this.redis.hgetall(key, (err, res) => {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  };

  hdel = (key: string, ...fields: string[]) => {
    return new Promise((resolve, reject) => {
      this.redis.hdel(key, fields, (err, res) => {
        if (err) return reject(err);
        return resolve(res > 0);
      });
    });
  };
}

export default new Caching();
