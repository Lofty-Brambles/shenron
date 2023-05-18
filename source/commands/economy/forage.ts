import type { Message } from "discord.js";

import type { Manager } from "@/core/manager";
import { COOLDOWNS, LEVELS, MATERIAL_EMOTES, TOOLS } from "@/core/constants";
import { Command } from "@/structures/command";
import { Utils } from "@/core/utils";

type Indeter<T> = T | undefined;

export default class Mine extends Command {
  constructor(client: Manager, name: string, category: string) {
    super(client, name, category);
  }

  public syntax: string = "";
  public description: string = "This is to chop some bushes for money!";
  public usage: 0 | 2 | 1 = LEVELS.MEMBER;

  public LOOT_TABLE = {
    SCALES: (condition: boolean): [number, number] =>
      condition ? [5, 10] : [10, 20],
    WOOD: (condition: boolean) => (condition ? 5 : 25),
    FLINT: (condition: boolean) => (condition ? 5 : 25),
    THATCH: (condition: boolean) => (condition ? 25 : 50),
    FIBRE: (condition: boolean) => (condition ? 25 : 50),
  };

  public cooldown = (condition: boolean) =>
    condition ? COOLDOWNS.HOUR : COOLDOWNS.HALF_AN_HOUR;

  async run(message: Message) {
    const results = this.checkCooldown(message.author.id);
    if (results.onCooldown)
      message.reply(`> You need to wait till you can forage again!
> You can do so <t:${results.availableOn}:R>`);

    const player = Utils.fetchPlayer(this.client, message.author.id);
    const hasSickle = Object.keys(player.inventory).includes(TOOLS.SICKLE.NAME);

    const loot = Utils.sortLoot(this.LOOT_TABLE, hasSickle);
    const description = this.generateDescription(message.author.id, loot);
    Utils.addLoot(player.inventory, loot);

    await message.channel.send(description);
    this.client.cooldowns[this.name][message.author.id] = `${
      new Date().getTime() + this.cooldown(hasSickle)
    }`;
  }

  checkCooldown(id: string) {
    const availableOn = this.client.cooldowns[this.name][id] as Indeter<string>;
    const onCooldown =
      availableOn === undefined || +availableOn < new Date().getTime();

    return { onCooldown, availableOn };
  }

  generateDescription(id: string, loot: Record<string, number>) {
    const lootString = Object.entries(loot)
      .map(([name, quantity], i) => {
        const item = name as keyof typeof MATERIAL_EMOTES;

        return `\`${i + 1}.\` +${quantity} ${MATERIAL_EMOTES[item]} ${
          item[0]
        }${item.slice(1).toLowerCase()}`;
      })
      .join("\n");

    return `> <@${id}> has gone foraging deep inside the jungles of Ark...
> He emerges with loot!
${lootString}`;
  }
}
