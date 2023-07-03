// Importazione delle varie librerie
import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { MessageEmbed } from 'discord.js';

// Importazione della struttura del comando
import { Command } from '../../interfaces/Command';

// Importazioni delle varie configurazioni
import { channels } from '../../config/config.json'

// Formato del codice
export const s_clear: Command = {
	data: new SlashCommandBuilder()
		.setName('s_clear')
		.setDescription('Cancella i messaggi in una chat. (SOLO STAFF)')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addIntegerOption((option:any) =>
			option.setName('msg')
				.setDescription('Il numero dei messaggi da eliminare.')
				.setRequired(true)),

	// !!! Super importante altrimenti il bot ti da errori come "Undefined" o "Null" !!!
	run: async (interaction: any) => {			
		const log = interaction.guild.channels.cache.get(channels.modsLogs);
		const msg: Number = interaction.options.getInteger('msg');
		const embed = new MessageEmbed()
			.setTitle('Messaggi cancellati!')
			.setDescription(`${msg} correttamente cancellati.`)
			.setColor('ORANGE')
			.setTimestamp()
			.setFooter({ text : interaction.user.tag, iconURL : interaction.user.displayAvatarURL() });
		if (msg < 1 || msg > 99) {
			return interaction.reply({ content: 'Devi inserire un numero tra 1 e 99.', ephemeral: true });
		}
		await interaction.channel.bulkDelete(msg, true).catch((error: any) => {
			console.error(error);
			interaction.reply({ content: 'C\'è stato un errore nella cancellazione dei messaggi.', ephemeral: true });
			return;
		});
		interaction.reply({ embeds : [embed] });
		await log.send({ embeds : [embed] });
		console.log('Comando /clear eseguito.');
	},
};