import { GuildMember } from "discord.js";

import { getServerConfig } from "../modules/getServerConfig";
import { errorHandler } from "../utils/errorHandler";
import { sendLogMessage } from "../utils/sendLogMessage";

/**
 * Handles the member add event. Sets a timeout to kick members
 * if they do not verify within 5 minutes.
 *
 * @param {GuildMember} member The GuildMember object representing the member that joined.
 */
export const guildMemberAdd = async (member: GuildMember): Promise<void> => {
  try {
    const guild = member.guild;
    const config = await getServerConfig(guild.id);
    if (!config || !config.verificationRole) {
      return;
    }
    if (config.logChannel) {
      await sendLogMessage(
        guild,
        config.logChannel,
        `⚠️ <@${member.id}> (${member.user.tag}) joined.`
      );
    }
    setTimeout(async () => {
      const updated = await member.fetch();
      if (
        !updated.roles.cache.find((r) => r.id === config.verificationRole) &&
        updated.kickable
      ) {
        await updated.kick();
        if (config.logChannel) {
          await sendLogMessage(
            guild,
            config.logChannel,
            `🛑 <@${member.id}> (${member.user.tag}) was kicked for not verifying.`
          );
        }
      }
    }, 1800000);
  } catch (e) {
    await errorHandler("guildMemberAdd", e);
  }
};
