// Importazioni delle librerie
import { SlashCommandBuilder } from '@discordjs/builders'
import { PermissionFlagsBits } from 'discord-api-types/v10'
import { MessageEmbed } from 'discord.js';

// Importazione della struttura del comando
import { Command } from '../../interfaces/Command';

// Importazioni delle varie configurazioni
import { channels } from '../../config/config.json'


// Formato del codice
export const s_ban: Command = {
	data: new SlashCommandBuilder()
		.setName('s_ban')
		.setDescription('Banna l\'utente dal server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setDMPermission(false)
		.addUserOption((option:any) =>
			option.setName('utente')
				.setDescription('L\'utente da bannare.')
				.setRequired(true))
		.addStringOption((option:any) =>
			option.setName('reason')
				.setDescription('La motivazione del ban.')
				.setRequired(true)),

	// !!! Super importante altrimenti il bot ti da errori come "Undefined" o "Null" !!!
	run: async (interaction: any) => {
		const log = interaction.guild.channels.cache.get(channels.modsLogs);
		const utente = interaction.options.getUser('utente');
		const reason = interaction.options.getString('reason');
		const user = interaction.guild.members.cache.get(utente.id);
		const embed = new MessageEmbed()
			.setTitle('Utente bannato!')
			.setDescription(`L'utente <@!${utente.id}> è stato correttamente bannato.`)
			.setColor('GREEN')
			.setTimestamp()
			.setFooter({ text : interaction.user.tag, iconURL : interaction.user.displayAvatarURL() })
			.addFields({ name : 'Reason', value : reason });
		const embedUser = new MessageEmbed()
			.setTitle('Sei stato bannato!')
			.setDescription(`Oh no! Sei stato bannato da ${interaction.guild.name}.`)
			.setColor('RED')
			.setTimestamp()
			.setFooter({ text : interaction.user.tag, iconURL : interaction.user.displayAvatarURL() })
			.addFields({ name : 'Reason', value : reason });
		if (user.id == interaction.user.id) return interaction.reply({ content :'Non puoi bannarti da solo!', ephemeral : true });
		if (user.id == interaction.guild.ban) return interaction.reply({ content :'Questo utente è già bannato dal server!', ephemeral : true  })
		if (user.roles.highest.position < interaction.user.roles.highest.position) {
			try {
				await user.send({ content : '\n', embeds :[embedUser] });
			}
			catch {
				interaction.followUp({ content : 'Non è stato possibile inviare il messaggio di avviso all\'utente', ephemeral: true });
			}
			interaction.guild.members.ban(user.id, { reason : reason, deleteMessageDays : 0 });
			await interaction.reply({ embeds : [embed] });
			await log.send({ embeds : [embed] });
		}
		else {
			interaction.reply({ content : 'Devi avere il ruolo più alto dell\'utente.', ephemeral : true });
		}
		console.log('Comando /ban eseguito.');
	},
};