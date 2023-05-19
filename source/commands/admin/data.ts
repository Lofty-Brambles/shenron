import type { Manager } from "@/core/manager";
import type { Message } from "discord.js";
import { Command } from "@/structures/command";
import { LEVELS } from "@/core/constants";

export default class Inventory extends Command {
  constructor(client: Manager, name: string, category: string) {
    super(client, name, category);
  }

  public syntax: string = "";
  public description: string = "Logs the JSON of inventory!";
  public usage: 0 | 2 | 1 = LEVELS.MEMBER;

  async run(message: Message) {
    message.channel.send(
      `\`\`\`json
${JSON.stringify(this.client.userData[message.author.id], null, 2)}\`\`\``,
    );
  }
}
