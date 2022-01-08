import { GuildMember } from "discord.js";

import { logHandler } from "../utils/logHandler";
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
      `⚠️ <@!${member.user.id}> (${member.user.tag}) has joined. Will kick in 5 minutes if they do not verify.`
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
          `🛑 <@!${member.user.id}> (${member.user.tag}) was kicked because they did not verify within 5 minutes.`
        );
      }
    }, 300000);
  } catch (e) {
    const err = e as Error;
    logHandler.log("error", `${err.message}\n${err.stack}`);
  }
};
