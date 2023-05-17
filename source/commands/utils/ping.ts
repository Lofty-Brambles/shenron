import type { Message } from "discord.js";

import type { Manager } from "@/core/manager";
import { LEVELS } from "@/core/constants";
import { Command } from "@/structures/command";

export default class Ping extends Command {
  constructor(client: Manager, name: string, category: string) {
    super(client, name, category);
  }

  public syntax: string = "";
  public description: string = "This is the bot's uptime.";
  public usage: 0 | 2 | 1 = LEVELS.ADMIN;

  run(message: Message) {
    message.channel.send(`> 🏓 | Pong! Websocket ping: ${this.client.ws.ping}
> The bot has been up since <t:${(new Date()).getTime() - process.uptime()}:R>`);
  }
}
