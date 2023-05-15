import type { ColorResolvable } from "discord.js"; 

export { default as DATA } from "../../.config.json";

export const DATABASE_NAME = "bot_data";
export const META_COLLECTION = "meta";

export const LEVELS = {
  MEMBER: 0,
  MANAGER: 1,
  ADMIN: 2,
} as const;

export const COMMANDS_FOLDER = "commands";
export const EVENTS_FOLDER = "events";

export const STANDARD_EXT = ".ts";
export const DISCORD_COLOUR: ColorResolvable = [30, 31, 34];
export const BULLET_EMOJI = "<:D_Arrow:1107350049144447138>";