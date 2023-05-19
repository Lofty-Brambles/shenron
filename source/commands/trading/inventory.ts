import type { Manager } from "@/core/manager";
import type { Message } from "discord.js";
import { Command } from "@/structures/command";
import { LEVELS, MATERIAL_EMOTES, BULLET_EMOJI, TOOLS } from "@/core/constants";
import { Utils } from "@/core/utils";

export default class Inventory extends Command {
  constructor(client: Manager, name: string, category: string) {
    super(client, name, category);
  }

  public syntax: string = "";
  public description: string =
    "This is to look at the contents of your inventory!";
  public usage: 0 | 2 | 1 = LEVELS.MEMBER;

  async run(message: Message) {
    const dot = BULLET_EMOJI;
    const inv = Utils.fetchPlayer(this.client, message.author.id).inventory;
    const toolsAndCoins = [...Object.keys(TOOLS), "SCALES"];

    const tools = Object.entries(inv).filter(([name]) =>
      Object.keys(TOOLS).includes(name),
    );
    const misc = Object.entries(inv).filter(
      ([name]) => !toolsAndCoins.includes(name),
    );

    const scalesMsg = `${dot} +${inv["SCALES"] ?? 0} ${MATERIAL_EMOTES["SCALES"]} Scales`;
    const toolsMsg = tools
      .map(([name, value]) => {
        const item = name as keyof typeof MATERIAL_EMOTES;
        const restOfName = name.replace("_", " ").slice(1).toLowerCase();
        return `${dot} +${value} ${MATERIAL_EMOTES[item]} ${name[0]}${restOfName}`;
      })
      .join("\n");
    const miscMsg = misc
      .map(([name, value]) => {
        const item = name as keyof typeof MATERIAL_EMOTES;
        const restOfName = name.slice(1).toLowerCase();
        return `${dot} +${value} ${MATERIAL_EMOTES[item]} ${name[0]}${restOfName}`;
      })
      .join("\n");

    message.channel.send(`\`\`\`INVENTORY\`\`\`
\` § \` **Balance**
${scalesMsg}
\` § \` **Tools**
${toolsMsg === "" ? "None" : toolsMsg}
\` § \` **Miscellaneous**
${miscMsg === "" ? "None" : miscMsg}`);
  }
}
