import { Guild, GuildMember } from "discord.js";

import { Verification } from "../database/models/Verification";
import { errorHandler } from "../utils/errorHandler";

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
      return;
    }
    await user.roles.add(verifyRole);
  } catch (e) {
    await errorHandler("verifyUser", e);
  }
};
