import type { Message } from "discord.js";

import type { Manager } from "@/core/manager";
import { LEVELS } from "@/core/constants";

export class Command {
  constructor(
    public client: Manager,
    public name: string,
    public category: string,
  ) {}

  public syntax: string = "";
  public description: string = "";
  public usage: (typeof LEVELS)[keyof typeof LEVELS] = LEVELS.MEMBER;

  run(message: Message): void | Promise<void> {}
}
