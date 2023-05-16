import type { ColorResolvable } from "discord.js";

export { default as DATA } from "../../.config.json";

export const COMMANDS_FOLDER = "commands";
export const EVENTS_FOLDER = "events";

export const DATABASE_NAME = "bot_data";
export const META_COLLECTION = "meta";
export const USER_COLLECTION = "users";

export const STANDARD_EXT = ".ts";
export const DISCORD_COLOUR: ColorResolvable = [30, 31, 34];
export const BULLET_EMOJI = "<:D_Arrow:1107350049144447138>";

export const LEVELS = {
  MEMBER: 0,
  MANAGER: 1,
  ADMIN: 2,
} as const;

export const INITIAL_STATS = {
  coins: 0,
  maxHp: 100,
  hp: 100,
  armor: 0,
  damage: 5,
  inventory: {} as Record<string, number>,
};

export const COOLDOWNS = {
  TEN_SECONDS: 10,
  MINUTE: 60,
  FIVE_MINUTES: 300,
  TEN_MIUNTES: 600,
  HALF_AN_HOUR: 1800,
  HOUR: 3600,
  TWO_HOURS: 7200,
  FIVE_HOURS: 18000,
  HALF_A_DAY: 43200,
  DAY: 86400,
  MONTH: 604800,
};
