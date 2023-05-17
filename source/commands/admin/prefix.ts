import type { Message } from "discord.js";

import type { Manager } from "@/core/manager";
import { LEVELS, META_COLLECTION } from "@/core/constants";
import { Command } from "@/structures/command";
import { Utils } from "@/core/utils";

export default class Prefix extends Command {
  constructor(client: Manager, name: string, category: string) {
    super(client, name, category);
  }

  public syntax: string = `[prefix]`;
  public description: string = "This is used to set a prefix for the bot.";
  public usage: 0 | 2 | 1 = LEVELS.ADMIN;

  async run(message: Message) {
    const arg = message.content.trim().split(" ").at(1);

    if (arg === undefined) {
      message.channel.send(Utils.generateSyntax(this));
      return;
    }

    this.client.prefix = arg;
    this.client.db!.syncData(META_COLLECTION, "prefix", arg);
    message.channel.send(
      `> The prefix is now set to \`${this.client.prefix}\``,
    );
  }
}
