import type { Manager } from "../../core/manager";
import type { Message } from "discord.js";
import { INITIAL_STATS, LEVELS, USER_COLLECTION } from "../../core/constants";
import { Command } from "../../core/structures/command";
import { Utils } from "../../core/utils";

export default class Start extends Command {
  constructor(client: Manager, name: string) {
    super(client, name);
  }

  public syntax: string = `${this.name.split("/").at(-1)}`;
  public description: string =
    "This gets you to start your journey into the dragon-lands!";
  public aliases: Set<string> = new Set();
  public disabled: boolean = false;
  public usage: 0 | 2 | 1 = LEVELS.MEMBER;

  async run(args: string[], message: Message) {
    if (await Utils.startCheck(this.client, message.author.id)) {
      message.reply(
        `> You have a profile already! Try \`${this.client.prefix}help\` for the rest of the commands!`,
      );
      return;
    }

    await this.client.db!.syncData(
      USER_COLLECTION,
      message.author.id,
      INITIAL_STATS,
    );

    message.reply(
      `> Your profile has been created! You can now look up all the commands under \`${this.client.prefix}help\`.`,
    );
  }
}
