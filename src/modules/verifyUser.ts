import { Guild, GuildMember } from "discord.js";

import { errorHandler } from "../utils/errorHandler";
import { sendLogMessage } from "../utils/sendLogMessage";

/**
 * Grants the verified role to a user.
 *
 * @param {GuildMember} user The user to verify.
 * @param {Guild} guild The guild the user is in.
 */
export const verifyUser = async (
  user: GuildMember,
  guild: Guild
): Promise<void> => {
  try {
    const verifyRole = await guild.roles.fetch(
      process.env.VERIFIED_ROLE || "oh no!"
    );

    if (!verifyRole) {
      await sendLogMessage("Could not locate verified role!");
      return;
    }
    await user.roles.add(verifyRole);
    await sendLogMessage(
      `✅ <@!${user.user.id}> (${user.user.tag}) was verified!`
    );
  } catch (e) {
    await errorHandler("verifyUser", e);
  }
};
