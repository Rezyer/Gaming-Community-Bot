const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { bot } = require('./src/config/config.json');

const rest = new REST({ version: '10' }).setToken(bot.token);
rest
	.get(Routes.applicationGuildCommands(bot.clientId, bot.guildId))
	.then((data) => {
		const promises = [];
		for (const command of data) {
			const deleteUrl = `${Routes.applicationGuildCommands(
				bot.clientId,
				bot.guildId,
			)}/${command.id}`;
			promises.push(rest.delete(deleteUrl));
		}
		return Promise.all(promises);
	});
