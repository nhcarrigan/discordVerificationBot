import { Guild, GuildMember } from "discord.js";

import { Verification } from "../database/models/Verification";
import { errorHandler } from "../utils/errorHandler";
import { sendLogMessage } from "../utils/sendLogMessage";

/**
 * Grants the verified role to a user.
 *
 * @param {GuildMember} user The user to verify.
 * @param {Guild} guild The guild the user is in.
 * @param {Verification} config The server configuration.
 */
export const verifyUser = async (
  user: GuildMember,
  guild: Guild,
  config: Verification
): Promise<void> => {
  try {
    const verifyRole = await guild.roles.fetch(config.verificationRole);

    if (!verifyRole) {
      if (config.logChannel) {
        await sendLogMessage(
          guild,
          config.logChannel,
          `⚠️ <@${user.id}> (${user.user.tag}) could not be verified! No verification role found.`
        );
      }
      return;
    }
    if (config.logChannel) {
      await sendLogMessage(
        guild,
        config.logChannel,
        `✅ <@${user.id}> (${user.user.tag}) was verified.`
      );
    }
    await user.roles.add(verifyRole);
  } catch (e) {
    await errorHandler("verifyUser", e);
  }
};
