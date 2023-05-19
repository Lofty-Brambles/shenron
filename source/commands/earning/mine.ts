import type { Message } from "discord.js";
import type { Manager } from "@/core/manager";
import { COOLDOWNS, LEVELS, TOOLS } from "@/core/constants";
import { Command } from "@/structures/command";
import { Utils } from "@/core/utils";

type Indeter<T> = T | undefined;

export default class Chop extends Command {
  constructor(client: Manager, name: string, category: string) {
    super(client, name, category);
  }

  public syntax: string = "";
  public description: string = "This is to mine some rocks for money!";
  public usage: 0 | 2 | 1 = LEVELS.MEMBER;

  public LOOT_TABLE = {
    SCALES: (condition: boolean): [number, number] =>
      condition ? [20, 25] : [35, 40],
    STONE: (condition: boolean) => (condition ? 50 : 75),
    FLINT: (condition: boolean) => (condition ? 50 : 75),
    METAL: (condition: boolean) => (condition ? 10 : 20),
  };

  public cooldown = (condition: boolean) =>
    condition ? COOLDOWNS.FOUR_HOURS : COOLDOWNS.TWO_HOURS;

  async run(message: Message) {
    const results = this.checkCooldown(message.author.id);
    if (results.onCooldown) {
      message.reply(`> You need to wait till you can mine some rocks again!
> You can do so <t:${results.availableOn}:R>`);
      return;
    }

    const player = Utils.fetchPlayer(this.client, message.author.id);
    const hasWoodPick = Object.keys(player.inventory).includes(
      TOOLS.WOOD_PICKAXE.TAG,
    );
    const hasMetalPick = Object.keys(player.inventory).includes(
      TOOLS.METAL_PICKAXE.TAG,
    );

    if (!hasWoodPick && !hasMetalPick) {
      message.reply(`> You need to craft up a hatchet!
Please look into the \`${this.client.prefix}craft\` command!`);
      return;
    }

    const loot = Utils.sortLoot(this.LOOT_TABLE, !hasMetalPick);
    const caption = "gone mining rocks, deep inside the jungles of Ark...";
    const desc = Utils.generateDescription(message.author.id, caption, loot);
    Utils.addLoot(player.inventory, loot);

    await message.channel.send(desc);
    this.client.cooldowns[this.name][message.author.id] = `${
      Utils.timestamp() + this.cooldown(!hasMetalPick)
    }`;
  }

  checkCooldown(id: string) {
    const availableOn = this.client.cooldowns[this.name][id] as Indeter<string>;
    const onCooldown =
      availableOn !== undefined && +availableOn > Utils.timestamp();

    return { onCooldown, availableOn };
  }
}
