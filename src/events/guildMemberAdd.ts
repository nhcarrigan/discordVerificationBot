import { GuildMember } from "discord.js";

import { errorHandler } from "../utils/errorHandler";

/**
 * Handles the member add event. Sets a timeout to kick members
 * if they do not verify within 5 minutes.
 *
 * @param {GuildMember} member The GuildMember object representing the member that joined.
 */
export const guildMemberAdd = async (member: GuildMember): Promise<void> => {
  try {
    setTimeout(async () => {
      const updated = await member.fetch();
      if (
        !updated.roles.cache.find(
          (role) => role.id === process.env.VERIFIED_ROLE
        )
      ) {
        await updated.kick();
      }
    }, 1800000);
  } catch (e) {
    await errorHandler("guildMemberAdd", e);
  }
};
