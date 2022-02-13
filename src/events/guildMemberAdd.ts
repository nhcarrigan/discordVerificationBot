import { GuildMember } from "discord.js";

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
    await sendLogMessage(
      `⚠️ <@!${member.user.id}> (${member.user.tag}) has joined. Will kick in 30 minutes if they do not verify.`
    );
    setTimeout(async () => {
      const updated = await member.fetch();
      if (
        !updated.roles.cache.find(
          (role) => role.id === process.env.VERIFIED_ROLE
        )
      ) {
        await updated.kick();
        await sendLogMessage(
          `🛑 <@!${member.user.id}> (${member.user.tag}) was kicked because they did not verify within 30 minutes.`
        );
      }
    }, 1800000);
  } catch (e) {
    await errorHandler("guildMemberAdd", e);
  }
};
