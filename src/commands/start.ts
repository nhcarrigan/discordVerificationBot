import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

import VerificationModel from "../database/models/Verification";
import { Command } from "../interfaces/Command";
import { getServerConfig } from "../modules/getServerConfig";
import { errorHandler } from "../utils/errorHandler";

export const start: Command = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription(
      "Starts the verification process in your server. Run this in your verification channel."
    )
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("What question do you want to ask?")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("answer-one")
        .setDescription("What is the correct answer to the question?")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("answer-two")
        .setDescription("What is the incorrect answer to the question?")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("answer-three")
        .setDescription("What is the incorrect answer to the question?")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("verification-role")
        .setDescription("What role should be given to the user when verified?")
        .setRequired(true)
    ),
  run: async (interaction) => {
    try {
      await interaction.deferReply();
      const { guild, member } = interaction;

      if (!guild || !member) {
        await interaction.editReply(
          "Cannot locate your guild/member record. Please try again later."
        );
        return;
      }

      if (
        typeof member.permissions === "string" ||
        !member.permissions.has("MANAGE_GUILD")
      ) {
        await interaction.editReply(
          "You do not have permission to run this command."
        );
        return;
      }

      const question = interaction.options.getString("question", true);
      const answerOne = interaction.options.getString("answer-one", true);
      const answerTwo = interaction.options.getString("answer-two", true);
      const answerThree = interaction.options.getString("answer-three", true);
      const verificationRole = interaction.options.getRole(
        "verification-role",
        true
      );

      const serverConfig =
        (await getServerConfig(guild.id)) ||
        (await VerificationModel.create({
          serverId: guild.id,
          question: "",
          answerOne: "",
          answerTwo: "",
          answerThree: "",
          verificationRole: "",
        }));

      serverConfig.question = question;
      serverConfig.answerOne = answerOne;
      serverConfig.answerTwo = answerTwo;
      serverConfig.answerThree = answerThree;
      serverConfig.verificationRole = verificationRole.id;
      await serverConfig.save();

      const embed = new MessageEmbed();
      embed.setTitle(`Welcome to ${guild.name}!`);
      embed.setDescription(
        "In order to verify, you need to answer a question. Answering incorrectly will result in a kick. Failure to verify in 30 minutes will result in a kick.\n\nClick the button below to get started."
      );

      const button = new MessageButton()
        .setLabel("Click here to verify!")
        .setEmoji("✅")
        .setCustomId("verify")
        .setStyle("SUCCESS");
      const row = new MessageActionRow().addComponents(button);

      await interaction.editReply({ embeds: [embed], components: [row] });
    } catch (err) {
      await errorHandler("start command", err);
      await interaction.editReply("Something went wrong.");
    }
  },
};
