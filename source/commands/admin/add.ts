import type { Message } from "discord.js";
import type { Manager } from "@/core/manager";
import { LEVELS, MATERIAL_EMOTES, TOOLS } from "@/core/constants";
import { Command } from "@/structures/command";
import { Utils } from "@/core/utils";

export default class Forage extends Command {
  constructor(client: Manager, name: string, category: string) {
    super(client, name, category);
  }

  public syntax: string = "[playerID] [item] [quantity]";
  public description: string = "This is to force add some item/money!";
  public usage: 0 | 2 | 1 = LEVELS.ADMIN;

  async run(message: Message) {
    const [_, playerPing, item, qty, ..._r] = message.content.trim().split(" ");
    const items = [...Object.keys(MATERIAL_EMOTES), ...Object.keys(TOOLS)];

    if (!/^<@\d>$/.test(playerPing)) {
      message.reply(`> You need to mention a player!
${Utils.generateSyntax(this)}`);
      return;
    }
    if (!items.includes(item.toUpperCase())) {
      message.reply(`> You need to mention a proper item name!
> Please substitute the spaces, if any, with _'s [Underscores].
${Utils.generateSyntax(this)}`);
      return;
    }
    if (isNaN(+qty)) {
      message.reply(`> You need to mention a proper positive number quantity!
${Utils.generateSyntax(this)}`);
      return;
    }

    const player = Utils.fetchPlayer(this.client, playerPing.slice(2, -1));
    const value = player.inventory[item.toUpperCase()];
    player.inventory[item.toUpperCase()] = value ? +qty + value : +qty;
    message.channel.send(`The player's inventory has been updated!
\`\`\`json
${JSON.stringify(player.inventory, null, 2)}\`\`\``);
  }
}
