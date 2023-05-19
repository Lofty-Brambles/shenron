import type { Message } from "discord.js";
import type { Manager } from "@/core/manager";
import { LEVELS, MATERIAL_EMOTES } from "@/core/constants";
import { Command } from "@/structures/command";
import { Utils } from "@/core/utils";

export default class Forage extends Command {
  constructor(client: Manager, name: string, category: string) {
    super(client, name, category);
  }

  public syntax: string = "";
  public description: string = "This is to collect your daily income!";
  public usage: 0 | 2 | 1 = LEVELS.MEMBER;

  async run(message: Message) {
    const player = Utils.fetchPlayer(this.client, message.author.id);
    player.streak = player.streak > 30 ? 1 : player.streak + 1;
    const money = 10 + player.streak * 2 + Math.floor(player.streak / 5) * 3;

    const currentIncome = player.inventory["SCALES"];
    player.inventory["SCALES"] = currentIncome ? currentIncome + money : money;

    message.channel.send(`> You collect your daily income!
> You have earned +${money} ${MATERIAL_EMOTES["SCALES"]} Scales.
> You have a streak of 🔥 ${player.streak} now! [Streaks reset every 30 days]`);
  }
}
