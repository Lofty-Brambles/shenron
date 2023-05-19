import type { Message } from "discord.js";
import type { Manager } from "@/core/manager";
import { COOLDOWNS, LEVELS, TOOLS } from "@/core/constants";
import { Command } from "@/structures/command";
import { Utils } from "@/core/utils";

type Indeter<T> = T | undefined;

export default class Forage extends Command {
  constructor(client: Manager, name: string, category: string) {
    super(client, name, category);
  }

  public syntax: string = "";
  public description: string = "This is to chop some bushes for money!";
  public usage: 0 | 2 | 1 = LEVELS.MEMBER;

  public LOOT_TABLE = {
    SCALES: (condition: boolean): [number, number] =>
      condition ? [5, 10] : [10, 20],
    BERRY: (condition: boolean) => (condition ? 50 : 75),
    WOOD: (condition: boolean) => (condition ? 5 : 25),
    FLINT: (condition: boolean) => (condition ? 5 : 25),
    THATCH: (condition: boolean) => (condition ? 25 : 50),
    FIBRE: (condition: boolean) => (condition ? 25 : 50),
  };

  public cooldown = (condition: boolean) =>
    condition ? COOLDOWNS.HOUR : COOLDOWNS.HALF_AN_HOUR;

  async run(message: Message) {
    const results = this.checkCooldown(message.author.id);
    if (results.onCooldown) {
      message.reply(`> You need to wait till you can forage again!
> You can do so <t:${results.availableOn}:R>`);
      return;
    }

    const player = Utils.fetchPlayer(this.client, message.author.id);
    const hasSickle = Object.keys(player.inventory).includes(TOOLS.SICKLE.TAG);

    const loot = Utils.sortLoot(this.LOOT_TABLE, !hasSickle);
    const caption = "gone foraging deep inside the jungles of Ark...";
    const desc = Utils.generateDescription(message.author.id, caption, loot);
    Utils.addLoot(player.inventory, loot);

    await message.channel.send(desc);
    this.client.cooldowns[this.name][message.author.id] = `${
      Utils.timestamp() + this.cooldown(!hasSickle)
    }`;
  }

  checkCooldown(id: string) {
    const availableOn = this.client.cooldowns[this.name][id] as Indeter<string>;
    const onCooldown =
      availableOn !== undefined && +availableOn > Utils.timestamp();

    return { onCooldown, availableOn };
  }
}
