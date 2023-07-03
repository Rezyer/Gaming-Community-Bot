// Importazioni delle librerie
import { SlashCommandBuilder } from '@discordjs/builders'
import { PermissionFlagsBits } from 'discord-api-types/v10'

// Importazione della struttura del comando
import { Command } from '../../interfaces/Command'

// Funzione del "Wait"
const wait = require('node:timers/promises').setTimeout;

// Formato del codice
export const dev_spam: Command = {
	data: new SlashCommandBuilder()
		.setName('dev_spam')
		.setDescription('Spamma i messaggi (100 messaggi).')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addStringOption((option:any) =>
			option.setName('messaggio')
				.setDescription('Messaggio da spammare (facoltativo)')
				.setRequired(false)),

		// !!! Super importante altrimenti il bot ti da errori come "Undefined" o "Null" !!!
		run: async (interaction: any) => {
		const messaggio = interaction.options.getString('messaggio')
		interaction.reply({ content : '100 messaggi in arrivo!', ephemeral : true });
		if(messaggio) {
			for (let v = 0; v < 100; v++) {
				const channel = interaction.channel;
				channel.send(`${messaggio} n° ${v + 1}`);
				wait(1000);
		}} else {
			if(!messaggio) {
			for (let v = 0; v < 100; v++) {
				const channel = interaction.channel;
				channel.send(`Messaggio n° ${v + 1}`);
				wait(1000);
			}
		}


		}

		console.log('Comando /spam eseguito.');
	} };