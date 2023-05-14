import type { Manager } from "../manager";

export abstract class Event {
  public client: Manager;

  public name: string;
  public abstract frequency: "on" | "once";
  constructor(client: Manager, name: string) {
    this.client = client;
    this.name = name;
  }

  abstract run(...args: unknown[]): unknown;
}

export class BaseEvent extends Event {
  public frequency: "on" | "once" = "on";

  constructor(client: Manager, name: string) {
    super(client, name);
  }

  run() {}
}
