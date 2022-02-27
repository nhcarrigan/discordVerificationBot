import { RewriteFrames } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import { Client } from "discord.js";

import { connectDatabase } from "./database/connectDatabase";
import { guildMemberAdd } from "./events/guildMemberAdd";
import { interactionCreate } from "./events/interactionCreate";
import { ready } from "./events/ready";
import { errorHandler } from "./utils/errorHandler";
import { registerCommands } from "./utils/registerCommands";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [
    new RewriteFrames({
      root: global.__dirname,
    }),
  ],
});

(async () => {
  try {
    const bot = new Client({
      intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"],
    });

    await connectDatabase();
    await registerCommands();

    await bot.login(process.env.TOKEN || "oh no");

    bot.on("ready", async () => await ready());

    bot.on("guildMemberAdd", async (member) => await guildMemberAdd(member));

    bot.on(
      "interactionCreate",
      async (interaction) => await interactionCreate(interaction)
    );
  } catch (e) {
    await errorHandler("index", e);
  }
})();
