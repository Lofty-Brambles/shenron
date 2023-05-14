import { MongoClient, type Db } from "mongodb";
import { DATA, DATABASE_NAME } from "./constants";

export class Database {
  private client: MongoClient;
  private db: Db | undefined;

  constructor() {
    this.client = new MongoClient(DATA.mongoURI);
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
}
