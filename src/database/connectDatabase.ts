import { connect } from "mongoose";

import { errorHandler } from "../utils/errorHandler";
import { logHandler } from "../utils/logHandler";

/**
 * Connects to the database.
 */
export const connectDatabase = async () => {
  try {
    await connect(process.env.MONGO_URI || "");
    logHandler.log("debug", "Connected to the database.");
  } catch (err) {
    await errorHandler("connectDatabase", err);
  }
};
