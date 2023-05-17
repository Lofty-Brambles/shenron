import type { Message } from "discord.js";
import type { Manager } from "@/core/manager";
import { Event } from "@/structures/event";
import { Utils } from "@/core/utils";

export default class MesageCreate extends Event {
  constructor(client: Manager, name: string) {
    super(client, name);
  }

  frequency: "on" | "once" = "on";
  async run(message: Message) {
    if (message.author.bot) return;

    const text = message.cleanContent;
    if (!text.startsWith(this.client.prefix)) return;

    const name = text.split(" ").at(0)?.slice(this.client.prefix.length) ?? "";
    const command = this.client.commands[name];

    if (command === undefined) {
      message.reply(`> Sorry, this command wasn't found!
> Please use \`${this.client.prefix}help\` to see all the commands!`);
      return;
    }

    const level = Utils.findUserLevel(this.client, message.author.id);
    if (command.usage > level) {
      message.reply(`Sorry, you cannot use this command!`);
      return;
    }

    command.run(message);
  }
}
