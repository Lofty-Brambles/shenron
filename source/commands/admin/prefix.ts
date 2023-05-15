import type { Manager } from "../../core/manager";
import type { Message } from "discord.js";
import { BULLET_EMOJI, LEVELS, META_COLLECTION } from "../../core/constants";
import { Command } from "../../core/structures/command";

export default class Prefix extends Command {
  constructor(client: Manager, name: string) {
    super(client, name);
  }

  public syntax: string = `${this.name.split("/").at(-1)} [prefix]`;
  public description: string = "This is used to set a prefix for the bot.";
  public aliases: Set<string> = new Set();
  public disabled: boolean = false;
  public usage: 0 | 2 | 1 = LEVELS.ADMIN;

  async run(args: string[], message: Message) {
    const arg = args.at(0)?.trim();

    let description = "";
    if (arg === undefined)
      description = `> ${BULLET_EMOJI} \`${this.client.prefix}${this.syntax}\` - ${this.description}`;
    else {
      this.client.prefix = arg;
      this.client.db!.setData(META_COLLECTION, "prefix", description);
      description = `> The prefix is now set to \`${this.client.prefix}\``;
    }

    message.channel.send(description);
  }
}
