import type { Manager } from "../../core/manager";
import { EmbedBuilder, type Message } from "discord.js";
import { DISCORD_COLOUR, LEVELS } from "../../core/constants";
import { Command } from "../../core/structures/command";

type EmbedField = { name: string; value: string };

export default class Help extends Command {
  constructor(client: Manager, name: string) {
    super(client, name);
  }

  public syntax: string = `${this.name.split("/").at(-1)} <command>`;
  public description: string =
    "This is used to know about all the commands available to the user.";
  public aliases: Set<string> = new Set();
  public disabled: boolean = false;
  public usage: 0 | 1 | 2 = LEVELS.MEMBER;

  async run(args: string[], message: Message) {
    const command = args.at(0);

    let info: EmbedField[] | null;
    if (command === undefined) info = this.generateCommands();
    else info = [this.getFullDescription(command)];

    const embed = new EmbedBuilder()
      .setColor(DISCORD_COLOUR)
      .setTitle("❔ | The Help Menu")
      .setFooter({ text: `${new Date().getTime()}` })
      .addFields(info);

    await message.channel.send({ embeds: [embed] });
  }

  public generateCommands() {
    return [...this.client.commands.entries()].map(([name, command]) => {
      return {
        name,
        value: `\`${command.name.split("/").join(" - ")}\` : \`${
          command.syntax
        }\``,
      };
    });
  }

  public getFullDescription(command: string) {
    const data = this.client.commands.get(command);
    if (data === undefined)
      return { name: "Oh no!", value: "This command is not valid!" };

    return {
      name: data.name.split("/").join(" - "),
      value: `${data.description}
**Usage -** \`${data.syntax}\`
**Aliases -** ${[...data.aliases.entries()].join(", ").slice(0, -2)}`,
    };
  }
}
