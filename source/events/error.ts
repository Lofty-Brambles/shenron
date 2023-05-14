import type { Manager } from "../core/manager";
import { Event } from "../core/structures/event";

export default class Error extends Event {
  constructor(client: Manager, name: string) {
    super(client, name);
  }

  frequency: "on" | "once" = "on";
  run(error: Error) {
    this.client.logger.error(error);
  }
}
