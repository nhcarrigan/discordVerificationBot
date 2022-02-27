import { GuildMember } from "discord.js";

import { getServerConfig } from "../modules/getServerConfig";
import { errorHandler } from "../utils/errorHandler";

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
    setTimeout(async () => {
      const updated = await member.fetch();
      if (!updated.roles.cache.find((r) => r.id === config.verificationRole)) {
        await updated.kick();
      }
    }, 1800000);
  } catch (e) {
    await errorHandler("guildMemberAdd", e);
  }
};
