import { createClient } from "redis";
import type { RedisClientType } from "redis";

export let redisClient: RedisClientType;

export async function redisClientConnect() {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    await redisClient.connect();
  } catch (error) {
    throw new Error("Redis connect error!");
  }
}
