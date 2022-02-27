import VerificationModel, {
  Verification,
} from "../database/models/Verification";
import { errorHandler } from "../utils/errorHandler";

/**
 * Loads the existing server configuration from the database.
 *
 * @param {string} guildId The ID for the guild to look up.
 * @returns {Verification} The server configuration, or null if it doesn't exist.
 */
export const getServerConfig = async (
  guildId: string
): Promise<Verification | null> => {
  try {
    const existingData = await VerificationModel.findOne({ serverId: guildId });

    if (existingData) {
      return existingData;
    }
    return null;
  } catch (err) {
    await errorHandler("getServerConfig", err);
    return null;
  }
};
