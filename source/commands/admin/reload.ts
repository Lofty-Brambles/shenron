import type { Message } from "discord.js";

import type { Manager } from "@/core/manager";
import { LEVELS } from "@/core/constants";
import { Command } from "@/structures/command";

export default class Reload extends Command {
  constructor(client: Manager, name: string, category: string) {
    super(client, name, category);
  }

  public syntax: string = "";
  public description: string = "This is used to reload the commands.";
  public usage: 0 | 2 | 1 = LEVELS.ADMIN;

  async run(message: Message) {
    const total = Object.keys(this.client.commands).length;
    await message.channel.send(`Reloading ${total} commands...`);
    this.client.loadCommands({ force: true });
    message.channel.send(`All ${total} commands reloaded.`);
  }
}
