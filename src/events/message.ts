import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";

import { errorHandler } from "../utils/errorHandler";

/**
 * Handles the message create event. Essentially used just to send the
 * initial verification post.
 *
 * @param {Message} message The Discord message object received.
 */
export const onMessage = async (message: Message): Promise<void> => {
  try {
    if (
      message.content === "~init" &&
      message.author.id === "465650873650118659"
    ) {
      const embed = new MessageEmbed();
      embed.setTitle("Welcome to Commit Your Code!");
      embed.setDescription(
        "In order to verify, you need to answer three questions. Answering incorrectly will result in a kick. Failure to verify in 5 minutes will result in a kick.\n\nClick the button below to get started.\n\nIf you get stuck, DM <@!465650873650118659>."
      );

      const button = new MessageButton()
        .setLabel("Click here to verify!")
        .setEmoji("✅")
        .setCustomId("verify")
        .setStyle("SUCCESS");
      const row = new MessageActionRow().addComponents(button);

      await message.channel.send({ embeds: [embed], components: [row] });
      await message.delete();
    }
  } catch (e) {
    await errorHandler("onMessage", e);
  }
};
