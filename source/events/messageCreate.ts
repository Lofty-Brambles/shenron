import type { Message } from "discord.js";
import type { Manager } from "../core/manager";
import { Event } from "../core/structures/event";
import { Utils } from "../core/utils";

export default class MesageCreate extends Event {
  constructor(client: Manager, name: string) {
    super(client, name);
  }

  frequency: "on" | "once" = "on";
  async run(message: Message) {
    if (message.author.bot) return;

    const text = message.cleanContent;
    if (!text.startsWith(this.client.prefix)) return;

    const args = text.split(" ");
    const command = this.client.commands.get(args[0].slice(1));

    if (command === undefined) {
      message.reply({
        content: `Sorry, this command wasn't found!
Please use \`${this.client.prefix}help\` to see all the commands!`,
        allowedMentions: { repliedUser: false },
      });
      return;
    }

    const level = Utils.findUserLevel(this.client, message.author.id);
    if (command.usage > level) {
      message.reply({
        content: `Sorry, you cannot use this command!`,
        allowedMentions: { repliedUser: false },
      });
      return;
    }

    command.run(
      args.filter((_, i) => i !== 0),
      message,
    );
  }
}
