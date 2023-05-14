export { default as DATA } from "../../.config.json";

export const DATABASE_NAME = "bot_data";
export const META_COLLECTION = "meta";

export const LEVELS = {
  MEMBER: 0,
  MANAGER: 1,
  ADMIN: 2,
} as const;

export const STANDARD_EXT = ".ts";
export const DISCORD_COLOUR = "#fdf3f6";
export const COMMANDS_FOLDER = "commands";
export const EVENTS_FOLDER = "events";