import type { Message } from "discord.js";
import type { Manager } from "@/core/manager";
import { LEVELS, MATERIAL_EMOTES } from "@/core/constants";
import { Command } from "@/structures/command";
import { Utils } from "@/core/utils";

export default class Forage extends Command {
  constructor(client: Manager, name: string, category: string) {
    super(client, name, category);
  }

  public syntax: string = "[item | all]";
  public description: string = "This is to chop some bushes for money!";
  public usage: 0 | 2 | 1 = LEVELS.MEMBER;

  public LOOT_VALUE: Record<string, number> = {
    WOOD: 15,
    THATCH: 5,
    FIBRE: 5,
    STONE: 10,
    FLINT: 5,
    METAL: 25,
  };

  async run(message: Message) {
    const player = Utils.fetchPlayer(this.client, message.author.id);
    const materials = Object.keys(MATERIAL_EMOTES).filter(
      (item) => item !== "SCALES",
    );

    const [_, item, ..._r] = message.content.trim().split(" ");
    if (!materials.includes(item) && /^all$/i.test(item)) {
      message.reply(`> This is not an item! Please use a proper item name!
${Utils.generateSyntax(this)}`);
      return;
    }

    let amount = 0;
    const tally = ([name, value]: [string, number]) => {
      const condition = /^all$/i.test(item)
        ? !materials.includes(name)
        : item.toUpperCase() !== name;

      if (condition) return true;
      amount += this.LOOT_VALUE[name] * value;
      return false;
    };

    player.inventory = Object.fromEntries(
      Object.entries(player.inventory).filter(tally),
    );
    const bal = player.inventory["SCALES"];
    player.inventory["SCALES"] = bal ? bal + amount : amount;
    message.channel.send(``);
  }
}
