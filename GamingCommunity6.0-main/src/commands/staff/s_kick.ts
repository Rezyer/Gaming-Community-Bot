// Importazione delle varie librerie
import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { MessageEmbed } from 'discord.js';

// Importazione della struttura del comando
import { Command } from '../../interfaces/Command';

// Formato del codice
export const s_kick: Command = {
	data: new SlashCommandBuilder()
		.setName('s_kick')
		.setDescription('Butta fuori l\'utente dal server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDMPermission(false)
		.addUserOption((option:any) =>
			option.setName('utente')
				.setDescription('L\'utente da kickare.')
				.setRequired(true))
		.addStringOption((option:any) =>
			option.setName('reason')
				.setDescription('La motivazione del kick.')
				.setRequired(true)),

	// !!! Super importante altrimenti il bot ti da errori come "Undefined" o "Null" !!!
	run: async (interaction: any) => {
		const utente = interaction.options.getUser('utente');
		const reason = interaction.options.getString('reason');
		const user = interaction.guild.members.cache.get(utente.id);
		const { channels } = require('../config.json');
		const log = interaction.guild.channels.cache.get(channels.modsLogs);
		const embed = new MessageEmbed()
			.setTitle('Utente kickato!')
			.setDescription(`L'utente <@!${utente.id}> è stato correttamente kickato.`)
			.setColor('GREEN')
			.setTimestamp()
			.setFooter({ text : interaction.user.tag, iconURL : interaction.user.displayAvatarURL() })
			.addFields({ name : 'Reason', value : reason });
		const embedUser = new MessageEmbed()
			.setTitle('Sei stato kickato!')
			.setDescription(`Oh no! Sei stato kickato da ${interaction.guild.name}.`)
			.setColor('RED')
			.setTimestamp()
			.setFooter({ text : interaction.user.tag, iconURL : interaction.user.displayAvatarURL() })
			.addFields({ name : 'Reason', value : reason });
		if (user.id == interaction.user.id) return interaction.reply({ content :'Non puoi kickarti da solo!', ephemeral : true });
		if (user.roles.highest.position < interaction.user.roles.highest.position) {
			try {
				await user.send({ content : '\n', embeds :[embedUser] });
			}
			catch {
				interaction.followUp({ content : 'Non è stato possibile inviare il messaggio di avviso all\'utente', ephemeral: true });
			}
			interaction.guild.members.kick(user.id, reason);
			await interaction.reply({ embeds : [embed] });
			await log.send({ embeds : [embed] });
		}
		else {
			interaction.reply({ content : 'Devi avere il ruolo più alto dell\'utente.', ephemeral : true });
		}
		console.log('Comando /kick eseguito.');
	},
};