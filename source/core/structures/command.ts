import type { Manager } from "../manager";
import type { Message } from "discord.js";
import type { LEVELS } from "../constants";

export abstract class Command {
  public client: Manager;

  public name: string;
  public abstract syntax: string;
  public abstract description: string;
  public abstract aliases: Set<string>;
  public abstract usage: (typeof LEVELS)[keyof typeof LEVELS];
  public abstract disabled: boolean;
  public cooldown?: (msg: Message) => number;

  constructor(client: Manager, name: string) {
    this.client = client;
    this.name = name;
  }

  abstract run(args: Array<string>, message: Message): void | Promise<void>;
}

export class BaseCommand extends Command {
  public syntax: string = "";
  public description: string = "";
  public aliases: Set<string> = new Set();
  public usage: 0 | 1 | 2 = 0;
  public disabled: boolean = true;

  constructor(client: Manager, name: string) {
    super(client, name);
  }

  run() {}
}
