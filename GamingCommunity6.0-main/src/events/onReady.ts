import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { Client } from "discord.js";
import { CommandList } from "../commands/_CommandList";
import { bot } from "../config/config.json"

export const onReady = async (BOT: Client) => {
  const rest = new REST({ version: "10" }).setToken(
    bot.token as string
  );
  
  const commandData = CommandList.map((command) => command.data.toJSON());

  await rest.put(
    Routes.applicationGuildCommands(
      BOT.user?.id || "missing id",
      bot.guildId as string
    ),
    { body: commandData }
  );
  
  BOT.user?.setActivity('i membri del server.', { type: 'WATCHING' });
  BOT.user?.setStatus('dnd');
	BOT.user?.setUsername('....');

  console.log("Ho caricato gli slash commands e il bot è ora pronto all'uso! ✅");
};