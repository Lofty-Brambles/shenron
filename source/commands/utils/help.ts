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
    const arg = args.at(0);
    const formatter = Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

    const description = arg ? this.getCommand(arg) : this.getDescription();
    const fields: EmbedField[] = arg ? [] : this.getCommands();

    const embed = new EmbedBuilder()
      .setColor(DISCORD_COLOUR)
      .setAuthor({ iconURL: this.client.user?.avatar!, name: "Shenron™" })
      .setFooter({ text: formatter.format(new Date()) })
      .setDescription(description)
      .setFields(fields);

    await message.channel.send({ embeds: [embed] });
  }

  public getDescription() {
    return `> <:D_Arrow:1107350049144447138> \`${this.client.prefix}help (command)\` - list of all command, or the description of one.
> \`[] - Required Options | () - Optional Options\`
`;
  }

  public getCommands() {
    const fields = new Map<string, string[]>();
    this.client.commands.forEach((command, name) => {
      const [category] = command.name.split("/");
      const stiffName = command.disabled ? `\`~~${name}~~\`` : `\`${name}\``;
      if (!fields.has(category)) fields.set(category, [stiffName]);
      else fields.get(category)?.push(stiffName);
    });

    return [...fields.entries()].map(([word, values]) => ({
      name: `¬ ${word[0].toUpperCase()}${word.slice(1)}`,
      value: values.join(", "),
    }));
  }

  public getCommand(name: string) {
    const command =
      this.client.commands.get(name) ??
      this.client.commands.get(this.client.aliases.get(name) ?? "");

    if (command === undefined)
      return `> Oh no, this command was not found!
${this.getDescription()}`;

    if (command.disabled)
      return `Oh no, this command is disabled!
${this.getDescription()}`;

    const [category] = command.name.split("/");
    return `> **${name} [${category}]**
${command.description}

<:D_Arrow:1107350049144447138> Usage: \`${this.client.prefix}${command.syntax}\`
<:D_Arrow:1107350049144447138> Aliases: ${[...command?.aliases.values()]
      .map((name) => `\`${name}\``)
      .join(", ")}`;
  }
}
