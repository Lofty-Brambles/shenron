import type { Manager } from "../../core/manager";
import type { Message } from "discord.js";
import { COOLDOWNS, LEVELS } from "../../core/constants";
import { Command } from "../../core/structures/command";
import { Utils } from "source/core/utils";

export default class Start extends Command {
  constructor(client: Manager, name: string) {
    super(client, name);
  }

  public syntax: string = `${this.name.split("/").at(-1)}`;
  public description: string = "This lets you safely earn some coins!";
  public aliases: Set<string> = new Set(["m"]);
  public disabled: boolean = false;
  public usage: 0 | 2 | 1 = LEVELS.MEMBER;
  public cooldown?: ((msg: Message) => number) | undefined = (msg: Message) => {
    const inv = this.client.userData.get(msg.author.id)?.inventory ?? {};
    return Object.keys(inv).includes("pickaxe")
      ? COOLDOWNS.HOUR
      : COOLDOWNS.TWO_HOURS;
  };

  async run(args: string[], message: Message) {
    if (!(await Utils.startCheck(this.client, message.author.id))) {
      message.reply(
        `> You need to create a profile first! Try \`${this.client.prefix}start\`!`,
      );
      return;
    }

    let range: [number, number] = [5, 10];
    const inv = this.client.userData.get(message.author.id)?.inventory ?? {};
    if (Object.keys(inv).includes("pickaxe")) range = [10, 20];
    const amount =
      Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];

    const content = `> <@${message.author.id}> mined and got some minerals!
> They fetched ${amount} scales.`;
    message.channel.send({ content });

    this.client.cooldowns
      .get(this.name.split("/")[1])
      ?.set(message.author.id, new Date().getTime());
  }
}
