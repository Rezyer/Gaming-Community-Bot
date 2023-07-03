// Importazione delle varie librerie
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

// Importazioni delle varie configurazioni
const manageEconomy = require('../../structures/models/manageEconomyDb.ts');

// Importazione della struttura del comando
import { Command } from '../../interfaces/Command';

export const u_portafoglio: Command = {
	data: new SlashCommandBuilder()
		.setName('u_portafoglio')
		.setDescription('Mostra il saldo attuale')
		.setDMPermission(false),

	// !!! Super importante altrimenti il bot ti da errori come "Undefined" o "Null" !!!
	run: async (interaction: any) => {

		const embedF = new MessageEmbed()
			.setTitle('Utente correttamente creato!')
			.setDescription('Sei stato correttamente aggiunto al database, ora puoi guadagnare punti e soldi.')
			.setColor('GREEN')
			.setTimestamp();
		const portafoglio = await manageEconomy.findOne({ userID: interaction.user.id });
		if (!portafoglio) return await interaction.reply({ embeds : [embedF] }), await manageEconomy.create({ userID: interaction.user.id });
		const embed = new MessageEmbed()
			.setTitle(interaction.user.username)
			.setURL(`https://discord.com/users/${interaction.user.id}`)
			.setDescription(`👤 | Profilo utente: <@!${interaction.user.id}>\n💰 | Saldo attuale: ${portafoglio.money}`)
			.setColor('DARK_GOLD')
			.setTimestamp();
		await interaction.reply({ embeds: [embed] });
		console.log('Comando /portafoglio eseguito.');
	},
};