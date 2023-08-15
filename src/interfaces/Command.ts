import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export interface Command {
  data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  /**
   * Handles the logic of the command.
   *
   * @param {ChatInputCommandInteraction} interaction The command interaction object.
   */
  run: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
