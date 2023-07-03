import { Client } from "discord.js";
import { IntentOptions } from "./config/IntentOptions";
import { onInteraction } from "./events/onInteraction";
import { connectDatabase } from "./structures/mongoose";
import { onReady } from "./events/onReady";
import { bot } from './config/config.json';
import { Temp } from './functions/voice';



(async () => {
  const BOT = new Client({intents: IntentOptions})
  await connectDatabase()
  BOT.on("ready", async () => await onReady(BOT));
  BOT.on("ready", (client) => {
  })

  BOT.on(
    "interactionCreate",
    async (interaction) => await onInteraction(interaction)
  );

  Temp(BOT);

  await BOT.login(bot.token);
})();