import { stat } from "node:fs/promises";

import type { Manager } from "@/core/manager";
import { Command } from "@/structures/command";
import {
  BULLET_EMOJI,
  INITIAL_STATS,
  LEVELS,
  USER_COLLECTION,
} from "@/core/constants";

type Inventory = Record<string, number>;

export type RangeLoot = (condition: boolean) => [number, number];
export type ChanceLoot = (condition: boolean) => number;
export type LootTable = Record<string, RangeLoot | ChanceLoot>;

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

  public static generateSyntax(command: Command) {
    return `> ${BULLET_EMOJI} \`${command.client.prefix}${command.name} ${command.syntax}\` - ${command.description}`;
  }

  public static fetchPlayer(client: Manager, id: string) {
    let player = client.userData[id];
    if (player !== undefined) return player;
    client.userData[id] = INITIAL_STATS;
    return client.userData[id];
  }

  public static sortLoot(lootTable: LootTable, condition: boolean) {
    const randRange = ([min, max]: [number, number]) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const trueChance = (chance: number) =>
      Math.floor(Math.random() * 100) + 1 <= chance;

    const loot: Record<string, number> = {};
    Object.keys(lootTable).forEach((key) => {
      const decider = lootTable[key](condition);
      const result =
        typeof decider === "object" ? randRange(decider) : trueChance(decider);
      loot[key] = typeof result === "number" ? result : Number(result);
    });

    return loot;
  }

  public static addLoot(inventory: Inventory, loot: Inventory) {
    Object.entries(loot).forEach(([key, value]) => {
      if (value === 0) return;
      inventory[key] = inventory[key] ? value : inventory[key] + value;
    });
    return inventory;
  }
}
