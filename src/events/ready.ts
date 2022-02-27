import { errorHandler } from "../utils/errorHandler";
import { logHandler } from "../utils/logHandler";

/**
 * Handles the ready event, which fires when the bot connects
 * to the gateway.
 */
export const ready = async (): Promise<void> => {
  try {
    logHandler.log("debug", "Connected to Discord!");
  } catch (e) {
    await errorHandler("ready", e);
  }
};
