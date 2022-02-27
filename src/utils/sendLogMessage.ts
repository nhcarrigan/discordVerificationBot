import { Guild } from "discord.js";

import { errorHandler } from "./errorHandler";

/**
 * Module to send a message to the configured log channel.
 *
 * @param {Guild} guild The Discord guild object.
 * @param {string} channelId The ID of the channel to send the message to.
 * @param {string} message The message to log.
 */
export const sendLogMessage = async (
  guild: Guild,
  channelId: string,
  message: string
) => {
  try {
    const channel = await guild.channels.fetch(channelId);

    if (!channel || !("send" in channel)) {
      return;
    }

    await channel.send(message);
  } catch (err) {
    await errorHandler("sendLogMessage", err);
  }
};
