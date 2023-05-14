import type { Manager } from "../core/manager";
import { Event } from "../core/structures/event";

export default class Warn extends Event {
  constructor(client: Manager, name: string) {
    super(client, name);
  }

  frequency: "on" | "once" = "on";
  run(warn: string) {
    this.client.logger.warn(warn);
  }
}
