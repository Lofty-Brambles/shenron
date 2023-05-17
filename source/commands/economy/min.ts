import type { Message } from "discord.js";

import type { Manager } from "@/core/manager";
import { LEVELS } from "@/core/constants";
import { Command } from "@/structures/command";

export default class Mine extends Command {
  constructor(client: Manager, name: string, category: string) {
    super(client, name, category);
  }

  public syntax: string = "";
  public description: string = "This is to mine for some money!";
  public usage: 0 | 2 | 1 = LEVELS.MEMBER;

  run(message: Message) {
    
  }
}
