import {
  CommandInteraction,
  Guild,
  GuildMember,
  Message,
  MessageActionRow,
  MessageSelectMenu,
  SelectMenuInteraction,
} from "discord.js";

import { errorHandler } from "../utils/errorHandler";
import { sendLogMessage } from "../utils/sendLogMessage";

import { verifyUser } from "./verifyUser";

/**
 * Handles the third question for the verification process.
 *
 * @param {CommandInteraction} interaction The command interaction.
 */
export const questionThree = async (
  interaction: SelectMenuInteraction
): Promise<void> => {
  try {
    if (!interaction.member) {
      await interaction.editReply("Oh no!");
      return;
    }
    const member = interaction.member as GuildMember;
    const question = new MessageSelectMenu()
      .setCustomId("channel-name")
      .setPlaceholder("What is the name of this channel?")
      .addOptions([
        {
          label: "welcome",
          description: "This channel is named welcome",
          value: "welcome",
        },
        {
          label: "general",
          description: "This channel is named general",
          value: "gen",
        },
        {
          label: "verification",
          description: "This channel is named verification",
          value: "ver",
        },
      ]);

    const component = new MessageActionRow().addComponents([question]);

    const first = (await interaction.editReply({
      content: "Please complete this form to gain access to the server.",
      components: [component],
    })) as Message;

    const collector = first.createMessageComponentCollector({
      filter: (el) => el.user.id === interaction.user.id,
      max: 1,
      time: 60000,
    });

    collector.on("collect", async (collected) => {
      if (collected.isSelectMenu()) {
        if (collected.values[0] === "ver") {
          await collected.reply({
            content: "Correct! Please wait...",
            components: [],
            ephemeral: true,
          });
          await interaction.editReply({
            content: "Congrats! You will be verified shortly.",
            components: [],
          });
          setTimeout(
            async () =>
              await verifyUser(
                interaction.member as GuildMember,
                interaction.guild as Guild
              ),
            5000
          );
        } else {
          await interaction.editReply({
            content: "You failed to select the correct answer.",
            components: [],
          });
          await collected.editReply({
            content: "You will now be kicked.",
          });
          setTimeout(async () => {
            await member.kick();
            await sendLogMessage(
              `🛑 <@!${interaction.user.id}> (${interaction.user.tag}) was kicked for answering the third question incorrectly: ${collected.values[0]}`
            );
          }, 5000);
        }
      }
    });
  } catch (e) {
    await errorHandler("questionThree", e);
  }
};
