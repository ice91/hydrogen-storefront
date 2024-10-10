// app/lib/server/database.ts

import { logger } from "./logger";
import { MongoClient, ObjectId } from "mongodb";
import { onExit } from "./exitHandler";
import type { User } from "../types/User";
import type { Session } from "../types/Session";
import type { Product } from "../types/Product";
import type { Order } from "../types/Order";
import type { Earning } from "../types/Earning";
import type { Storefront } from "../types/Storefront";
import type { Category } from "../types/Category";

/**
 * Environment variables interface
 */
interface Env {
  MONGODB_URL: string;
  MONGODB_DIRECT_CONNECTION: string;
  MONGODB_DB_NAME: string;
}

class Database {
  private client: MongoClient;
  private static instance: Database;
  private env: Env;

  private constructor(env: Env) {
    this.env = env;

    if (!this.env.MONGODB_URL) {
      throw new Error("Please specify the MONGODB_URL environment variable inside .env.local.");
    }

    this.client = new MongoClient(this.env.MONGODB_URL, {
      directConnection: this.env.MONGODB_DIRECT_CONNECTION === "true",
    });

    this.client.connect().catch((err) => {
      logger.error(err, "Connection error");
      process.exit(1);
    });

    const dbName = this.env.MONGODB_DB_NAME + (process.env.NODE_ENV === "test" ? "-test" : "");
    this.client.db(dbName);
    this.client.on("open", () => this.initDatabase());

    // Disconnect DB on exit
    onExit(() => this.client.close(true));
  }

  /**
   * 获取单例实例
   */
  public static getInstance(env: Env): Database {
    if (!Database.instance) {
      if (!env) {
        throw new Error("Database has not been initialized with env variables.");
      }
      Database.instance = new Database(env);
    }
    return Database.instance;
  }

  /**
   * 获取 MongoDB 客户端
   */
  public getClient(): MongoClient {
    return this.client;
  }

  /**
   * 获取所有集合
   */
  public getCollections() {
    const dbName = this.env.MONGODB_DB_NAME + (process.env.NODE_ENV === "test" ? "-test" : "");
    const db = this.client.db(dbName);
    return {
      users: db.collection<User>("users"),
      sessions: db.collection<Session>("sessions"),
      products: db.collection<Product>("products"),
      orders: db.collection<Order>("orders"),
      earnings: db.collection<Earning>("earnings"),
      storefronts: db.collection<Storefront>("storefronts"),
      categories: db.collection<Category>("categories"),
      conversations: db.collection<any>("conversations"), // Define types as needed
      settings: db.collection<any>("settings"), // Define types as needed
    };
  }

  /**
   * 初始化数据库，创建索引等
   */
  private initDatabase() {
    const { users, sessions, products, orders, earnings, storefronts, categories } = this.getCollections();

    // 创建索引示例
    users.createIndex({ hfUserId: 1 }, { unique: true }).catch((e) => logger.error(e));
    sessions.createIndex({ sessionId: 1 }, { unique: true }).catch((e) => logger.error(e));
    products.createIndex({ userId: 1 }).catch((e) => logger.error(e));
    orders.createIndex({ userId: 1, productId: 1 }).catch((e) => logger.error(e));
    earnings.createIndex({ userId: 1, orderId: 1 }).catch((e) => logger.error(e));
    storefronts.createIndex({ userId: 1 }).catch((e) => logger.error(e));
    categories.createIndex({ parentId: 1 }).catch((e) => logger.error(e));
    // 其他索引...
  }
}

/**
 * Function to initialize and get collections
 */
export async function getCollections(env: Env) {
  const db = Database.getInstance(env);
  // Wait for the connection to be established
  await db.getClient().connect();
  return db.getCollections();
}
