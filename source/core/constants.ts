import type { ColorResolvable } from "discord.js";

export { default as ENV } from "../../.config.json";

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
  inventory: {} as Record<string, number>,
  hitpoints: 100,
  damage: 5,
  scales: 0,
  level: 1,
  exp: 0,
};

export const TOOLS = {
  WOOD_HATCHET: {
    NAME: "Wooden Hatchet",
    EMOTE: "",
  },
  WOOD_PICKAXE: {
    NAME: "Wooden Pickaxe",
    EMOTE: "",
  },
  METAL_HATCHET: {
    NAME: "Metal Hatchet",
    EMOTE: "",
  },
  METAL_PICKAXE: {
    NAME: "Metal Pickaxe",
    EMOTE: "",
  },
  SICKLE: {
    NAME: "Sickle",
    EMOTE: "",
  },
};

export const MATERIAL_EMOTES = {
  SCALES: "",
  WOOD: "<:Wood:1108541714387435521>",
  THATCH: "<:Thatch:1108541733312135240>",
  FIBRE: "<:Fibre:1108541755659407422>",
  STONE: "",
  FLINT: "<:Flint:1108541789817819227>",
  METAL: "",
};

export const COOLDOWNS = {
  TEN_SECONDS: 10,
  MINUTE: 60,
  FIVE_MINUTES: 300,
  TEN_MIUNTES: 600,
  HALF_AN_HOUR: 1800,
  HOUR: 3600,
  TWO_HOURS: 7200,
  FOUR_HOURS: 14400,
  FIVE_HOURS: 18000,
  HALF_A_DAY: 43200,
  DAY: 86400,
  MONTH: 604800,
};
