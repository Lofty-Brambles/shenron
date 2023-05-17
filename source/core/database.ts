import { MongoClient, type Db } from "mongodb";
import { ENV, DATABASE_NAME, USER_COLLECTION } from "./constants";

export class Database {
  private client: MongoClient;
  private db: Db | undefined;

  constructor() {
    this.client = new MongoClient(ENV.mongoURI);
  }

  public async connect() {
    await this.client.connect();
    this.db = this.client.db(DATABASE_NAME);
  }

  public async syncData<T>(page: string, key: string, initial: T) {
    const collection = this.db!.collection(page);
    const value = await collection.findOne({
      [key]: { $exists: true },
    });

    if (value !== null) return value[key];

    await collection.insertOne({ [key]: initial });
    return initial;
  }

  public async syncUserData<T extends Record<string, any>>() {
    const map: Record<string, Omit<T, "_id">> = {};

    const collection = this.db!.collection(USER_COLLECTION);
    const cursor = collection.find<T>({ _id: { $exists: true } });
    for await (const doc of cursor) {
      const { _id, ...stats } = doc;
      map["_id"] = stats;
    }

    return map;
  }

  public async checkExistence<T>(page: string, query: Object) {
    const collection = this.db!.collection(page);
    return !!(await collection.findOne(query));
  }
}
