// Importazione delle varie librerie
import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { MessageEmbed } from 'discord.js';

// Importazioni delle varie configurazioni
import { channels } from '../../config/config.json'

// Importazione della struttura del comando
import { Command } from '../../interfaces/Command';

export const s_unban: Command = {
	data: new SlashCommandBuilder()
		.setName('s_unban')
		.setDescription('Sbanna l\'utente dal server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setDMPermission(false)
		.addStringOption((option:any) =>
			option.setName('id')
				.setDescription('L\'ID dell\'utente da bannare.')
				.setRequired(true))
		.addStringOption((option:any) =>
			option.setName('reason')
				.setDescription('La motivazione dell\'unban.')
				.setRequired(true)),
				
	// !!! Super importante altrimenti il bot ti da errori come "Undefined" o "Null" !!!
	run: async (interaction: any) => {
		const user = interaction.options.getString('id');
		const reason = interaction.options.getString('reason');
		const log = interaction.guild.channels.cache.get(channels.modsLogs);
		const embed = new MessageEmbed()
		.setTitle('Utente sbannato!')
		.setDescription(`L'utente <@!${user}> è stato correttamente bannato.`)
		.setColor('GREEN')
		.setTimestamp()
		.setFooter({ text : interaction.user.tag, iconURL : interaction.user.displayAvatarURL() })
		.addFields({ name : 'Reason', value : reason });
		try {
			await interaction.guild.members.unban(user);
		}
		catch (error: any) {
			console.log(error)
			return interaction.reply({ content : 'Impossibile sbannare l\'utente, verifica sia un Id e che l\'account non sia stato eliminato.', ephemeral : true });
			
		}
		await interaction.reply({ embeds : [embed] });
		await log.send({ embeds : [embed] });
		console.log('Comando /unban eseguito.');
	},
};