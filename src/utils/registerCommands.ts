import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

import { CommandList } from "../commands/CommandList";

import { errorHandler } from "./errorHandler";
import { logHandler } from "./logHandler";

/**
 * Registers the commands either globally or in the home guild, based
 * on the environment set.
 */
export const registerCommands = async () => {
  try {
    const botId = process.env.BOT_ID as string;
    const homeGuild = process.env.HOME_GUILD as string;
    const rest = new REST({ version: "10" }).setToken(
      process.env.TOKEN as string
    );

    const commandData = CommandList.map((command) => command.data.toJSON());

    if (process.env.NODE_ENV === "production") {
      logHandler.log("http", "registering global commands");
      await rest.put(Routes.applicationCommands(botId), { body: commandData });
    } else {
      logHandler.log("http", "registering home guild commands");
      await rest.put(Routes.applicationGuildCommands(botId, homeGuild), {
        body: commandData,
      });
    }
  } catch (err) {
    await errorHandler("registerCommands", err);
  }
};
