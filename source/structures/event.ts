import type { Manager } from "@/core/manager";

export class Event {
  public client: Manager;
  public name: string;

  public frequency: "on" | "once" = "on";
  constructor(client: Manager, name: string) {
    this.client = client;
    this.name = name;
  }

  run(...args: unknown[]): void | Promise<void> {}
}
