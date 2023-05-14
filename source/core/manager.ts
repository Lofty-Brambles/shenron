import pino, { type Logger, type LoggerOptions } from "pino";
import { Client, type ClientOptions } from "discord.js";

import { readdir, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { Command, BaseCommand } from "./structures/command";
import { Event, BaseEvent } from "./structures/event";
import { Database } from "./database";
import { Utils } from "./utils";
import {
  DATA,
  STANDARD_EXT,
  EVENTS_FOLDER,
  COMMANDS_FOLDER,
  META_COLLECTION,
} from "./constants";

const __dirname = dirname(fileURLToPath(import.meta.url));

const pinoConfig: LoggerOptions = {
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
};

type MetaUserIDs = {
  managers: string[];
  admins: string[];
};

export class Manager extends Client {
  public db: Database | undefined;
  public logger: Logger;

  public commands = new Map<string, Command>();
  public aliases = new Map<string, string>();
  public cooldowns = new Map<string, Map<string, number>>();

  public prefix: string;
  public metaUserIDs: MetaUserIDs | undefined;

  constructor(options: ClientOptions) {
    super(options);
    this.logger = pino(pinoConfig);
    this.prefix = DATA.prefix;
  }

  public async connect() {
    this.logger.info("The bot is starting up: initiating boot");

    this.logger.info("Connnecting to database: connection in process");
    this.db = new Database();
    await this.db.connect();

    this.logger.info("Loading commands: creating command cache");
    await this.loadCommands();

    await this.loadMetaInfo();

    this.logger.info("Loading events: attaching events to emitter");
    await this.loadEvents();

    await this.login(DATA.token);
    this.logger.info(`Ready, logged in as ${this.user?.username}!`);
  }

  public async loadMetaInfo() {
    this.logger.info("Loading required user ID's: syncing ID's");
    this.metaUserIDs = await this.db!.syncData<MetaUserIDs>(
      META_COLLECTION,
      "metaUserIDs",
      {
        admins: DATA.admins,
        managers: DATA.managers,
      },
    );

    this.logger.info("Loading required cooldowns: cooldown syncing");
    this.cooldowns = await this.db!.syncData(
      META_COLLECTION,
      "cooldowns",
      this.cooldowns,
    );
  }

  public async loadCommands(options: { force: boolean } = { force: false }) {
    const commandsPath = join(__dirname, "..", COMMANDS_FOLDER);
    if (!(await Utils.exists(commandsPath)))
      this.logger.error(`Could not find module: ${commandsPath}`);

    if (options.force) {
      this.commands = new Map();
      this.aliases = new Map();
      this.cooldowns = new Map();
    }

    const categories = await readdir(commandsPath);
    await Utils.PromiseMap(categories, async (category) => {
      const categoryPath = join(commandsPath, category);

      if (!(await stat(categoryPath)).isDirectory()) return;

      const categoryFiles = await readdir(categoryPath);
      const commands = categoryFiles
        .filter((file) => file.endsWith(STANDARD_EXT))
        .map((commandName) => join(categoryPath, commandName));

      const register = async (cmd: string) => await this.registerCommand(cmd);
      await Utils.PromiseMap(commands, register);
    });
  }

  public async loadEvents() {
    const eventsPath = join(__dirname, "..", EVENTS_FOLDER);
    if (!(await Utils.exists(eventsPath)))
      this.logger.error(`Could not find module: ${eventsPath}`);

    const eventFiles = await readdir(eventsPath);
    const events = eventFiles.filter((file) => file.endsWith(STANDARD_EXT));

    await Utils.PromiseMap(events, async (eventName) => {
      const eventPath = join(eventsPath, eventName);
      const event = (await import(eventPath)).default as typeof BaseEvent;
      const instance = new event(this, eventName.slice(0, -3));

      this[instance.frequency](
        instance.name,
        //@ts-ignore
        (...args) => instance.run(...args),
      );
    });
  }

  private async registerCommand(path: string) {
    const command = (await import(path)).default as typeof BaseCommand;
    const [category, commandName] = Utils.getLocation(path);
    const instance = new command(this, `${category}/${commandName}`);

    if (this.commands.has(commandName)) {
      this.logger.error(`Commands can't have same names: ${commandName} exist`);
      return;
    }

    this.logger.info(`Loading command: ${commandName}`);
    this.commands.set(commandName, instance);
    this.cooldowns.set(commandName, new Map());

    instance.aliases.forEach((alias) => {
      if (![...this.aliases.keys()].includes(alias))
        this.aliases.set(alias, commandName);
      else {
        this.logger.warn(`Alias exists: removed ${alias} for ${commandName}`);
        instance.aliases.delete(alias);
      }
    });
  }
}
