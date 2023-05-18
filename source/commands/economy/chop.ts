import type { Message } from "discord.js";

import type { Manager } from "@/core/manager";
import { COOLDOWNS, LEVELS, MATERIAL_EMOTES, TOOLS } from "@/core/constants";
import { Command } from "@/structures/command";
import { Utils } from "@/core/utils";

type Indeter<T> = T | undefined;

export default class Chop extends Command {
  constructor(client: Manager, name: string, category: string) {
    super(client, name, category);
  }

  public syntax: string = "";
  public description: string = "This is to chop some trees for money!";
  public usage: 0 | 2 | 1 = LEVELS.MEMBER;

  public LOOT_TABLE = {
    SCALES: (condition: boolean): [number, number] =>
      condition ? [15, 20] : [25, 30],
    WOOD: (condition: boolean) => (condition ? 50 : 75),
    THATCH: (condition: boolean): [number, number] =>
      condition ? [1, 3] : [3, 8],
    FIBRE: (condition: boolean): [number, number] =>
      condition ? [1, 3] : [3, 8],
  };

  public cooldown = (condition: boolean) =>
    condition ? COOLDOWNS.FOUR_HOURS : COOLDOWNS.TWO_HOURS;

  async run(message: Message) {
    const results = this.checkCooldown(message.author.id);
    if (results.onCooldown) {
      message.reply(`> You need to wait till you can chop trees again!
> You can do so <t:${results.availableOn}:R>`);
      return;
    }

    const player = Utils.fetchPlayer(this.client, message.author.id);
    const hasWoodAxe = Object.keys(player.inventory).includes("WOOD_HATCHET");
    const hasMetalAxe = Object.keys(player.inventory).includes("METAL_HATCHET");

    if (!hasWoodAxe && !hasMetalAxe) {
      message.reply(`> You need to craft up a hatchet!
Please look into the \`${this.client.prefix}craft\` command!`);
      return;
    }

    const loot = Utils.sortLoot(this.LOOT_TABLE, hasMetalAxe);
    const caption = "gone chopping for lumber, deep inside the jungles of Ark...";
    const desc = Utils.generateDescription(message.author.id, caption, loot);
    Utils.addLoot(player.inventory, loot);

    await message.channel.send(desc);
    this.client.cooldowns[this.name][message.author.id] = `${
      Utils.timestamp() + this.cooldown(hasMetalAxe)
    }`;
  }

  checkCooldown(id: string) {
    const availableOn = this.client.cooldowns[this.name][id] as Indeter<string>;
    const onCooldown =
      availableOn !== undefined && +availableOn > Utils.timestamp();

    return { onCooldown, availableOn };
  }
}
