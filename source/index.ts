import { GatewayIntentBits } from "discord.js";
import { Manager } from "./core/manager";

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
];

const manager = new Manager({ intents });

manager.connect();
