import {
  ButtonInteraction,
  Guild,
  GuildMember,
  Message,
  MessageActionRow,
  MessageSelectMenu,
} from "discord.js";

import { Verification } from "../database/models/Verification";
import { errorHandler } from "../utils/errorHandler";

import { randomiseAnswers } from "./randomiseAnswers";
import { verifyUser } from "./verifyUser";

/**
 * Asks the verification question.
 *
 * @param {ButtonInteraction} interaction The command interaction.
 * @param {Verification} config The server configuration.
 */
export const askQuestion = async (
  interaction: ButtonInteraction,
  config: Verification
): Promise<void> => {
  try {
    if (!interaction.member) {
      await interaction.editReply("Oh no!");
      return;
    }
    const randomChoices = randomiseAnswers(config);
    const member = interaction.member as GuildMember;
    const question = new MessageSelectMenu()
      .setCustomId("server-owner")
      .setPlaceholder("Who is the owner of the server?")
      .addOptions(randomChoices);

    const component = new MessageActionRow().addComponents([question]);

    const first = (await interaction.editReply({
      content:
        "Hello! Welcome to the verification process!\nPlease answer this question. You have one minute to answer. Answering incorrectly will result in a kick.\nTo select an answer, click the dropdown!",
      components: [component],
    })) as Message;

    const collector = first.createMessageComponentCollector({
      filter: (el) => el.user.id === interaction.user.id,
      max: 1,
      time: 60000,
    });

    collector.on("collect", async (collected) => {
      if (collected.isSelectMenu()) {
        await collected.deferReply({ ephemeral: true });
        if (collected.values[0] === "one") {
          await interaction.editReply({
            content: "Correct! Here comes the next question.",
            components: [],
          });
          await verifyUser(
            collected.member as GuildMember,
            collected.guild as Guild,
            config
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
          }, 5000);
        }
      }
    });
  } catch (e) {
    await errorHandler("askQuestion", e);
  }
};
