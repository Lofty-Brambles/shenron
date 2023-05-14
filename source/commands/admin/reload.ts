import type { Manager } from "../../core/manager";
import type { Message } from "discord.js";
import { LEVELS } from "../../core/constants";
import { Command } from "../../core/structures/command";

export default class Reload extends Command {
  constructor(client: Manager, name: string) {
    super(client, name);
  }

  public syntax: string = `${this.name.split("/").at(-1)}`;
  public description: string = "This is used to reload the commands.";
  public aliases: Set<string> = new Set("reset");
  public disabled: boolean = false;
  public usage: 0 | 2 | 1 = LEVELS.ADMIN;

  async run(args: string[], message: Message) {
    const total = this.client.commands.size;
    await message.channel.send(`Reloading ${total} commands...`);
    this.client.loadCommands({ force: true });
    message.channel.send(`All ${total} commands reloaded.`);
  }
}
