import { Interaction } from "discord.js";

import { CommandList } from "../commands/CommandList";
import { askQuestion } from "../modules/askQuestion";
import { getServerConfig } from "../modules/getServerConfig";
import { errorHandler } from "../utils/errorHandler";

/**
 * Handles the interactionCreate event.
 *
 * @param {Interaction} interaction The interaction received over the gateway.
 */
export const interactionCreate = async (
  interaction: Interaction
): Promise<void> => {
  try {
    if (interaction.isChatInputCommand()) {
      const target = CommandList.find(
        (command) => command.data.name === interaction.commandName
      );
      if (!target) {
        return;
      }
      await target.run(interaction);
    }
    if (interaction.isButton()) {
      const { customId } = interaction;
      if (customId === "verify") {
        await interaction.deferReply({ ephemeral: true });
        if (!interaction.guild) {
          await interaction.editReply("Cannot locate your guild record.");
          return;
        }
        const config = await getServerConfig(interaction.guild.id);
        if (!config) {
          await interaction.editReply("Cannot load question data.");
          return;
        }
        await askQuestion(interaction, config);
      }
    }
  } catch (e) {
    await errorHandler("interactionCreate", e);
  }
};
