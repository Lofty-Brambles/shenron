import { stat } from "node:fs/promises";

import type { Manager } from "./manager";
import { LEVELS, USER_COLLECTION } from "./constants";

export class Utils {
  public static async exists(path: string) {
    try {
      await stat(path);
      return true;
    } catch (error) {
      return false;
    }
  }

  public static async PromiseMap<T, K>(
    array: T[],
    callback: (element: T) => K,
  ) {
    return Promise.all(array.map(callback));
  }

  public static getLocation(path: string) {
    const spliced = path.split("/");
    const category = spliced.at(-2)!;
    const command = spliced.at(-1)!.slice(0, -3);
    return [category, command];
  }

  public static findUserLevel(client: Manager, id: string) {
    if (client.metaUserIDs!.admins.includes(id)) return LEVELS.ADMIN;
    if (client.metaUserIDs!.managers.includes(id)) return LEVELS.MANAGER;
    return LEVELS.MEMBER;
  }

  public static async startCheck(client: Manager, _id: string) {
    return await client.db!.checkExistence(USER_COLLECTION, { _id });
  }
}
