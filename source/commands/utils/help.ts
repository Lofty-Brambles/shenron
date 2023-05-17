import type { Message } from "discord.js";

import type { Manager } from "@/core/manager";
import { BULLET_EMOJI, LEVELS } from "@/core/constants";
import { Command } from "@/structures/command";
import { Utils } from "@/core/utils";

export default class Help extends Command {
  constructor(client: Manager, name: string, category: string) {
    super(client, name, category);
  }

  public syntax: string = "(command)";
  public description: string =
    "This is used to know about all the commands available to the user.";
  public usage: 0 | 1 | 2 = LEVELS.MEMBER;

  run(message: Message) {
    const arg = message.content.trim().split(" ").at(1);
    const description = arg ? this.getCommand(arg) : this.getDescription();
    message.channel.send(description);
  }

  getCommand(name: string) {
    const command = this.client.commands[name];
    if (command === undefined)
      return `> Sorry, this command wasn't found!
> Please use \`${this.client.prefix}help\` to see all the commands!`;

    return `> **${name} [${command.category}]**
${command.description}

${BULLET_EMOJI} Usage: \`${this.client.prefix}${name} ${command.syntax}\``;
  }

  getDescription() {
    const collection: Record<string, string[]> = {};
    Object.entries(this.client.commands).forEach(([_, command]) => {
      if (collection[command.category] === undefined)
        collection[command.category] = [command.name];
      else collection[command.category].push(command.name);
    });

    Object.entries(collection).reduce((string, [category, names]) => {
      return `${string}
> **${category[0].toUpperCase()}${category.slice(1)}**
${names.map((name) => `\`${name}\``).join(", ")}`;
    }, "");

    return `> ${Utils.generateSyntax(this)}
> \`[] - Required Options | () - Optional Options\`
`;
  }
}
