import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export interface Command {
  data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  /**
   * Handles the logic of the command.
   *
   * @param {CommandInteraction} interaction The command interaction object.
   */
  run: (interaction: CommandInteraction) => Promise<void>;
}
