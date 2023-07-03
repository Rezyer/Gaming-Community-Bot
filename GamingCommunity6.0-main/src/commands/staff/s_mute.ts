// Importazione delle varie librerie
import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { MessageEmbed } from 'discord.js';
import ms from 'ms';

// Importazioni delle varie configurazioni
import { channels } from '../../config/config.json'

// Importazione della struttura del comando
import { Command } from '../../interfaces/Command';

// Formato del codice
export const s_mute: Command = {
	data: new SlashCommandBuilder()
		.setName('s_mute')
		.setDescription('Mette l\'utente taggato in timeout.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.setDMPermission(false)
		.addUserOption((option:any) =>
			option.setName('utente')
				.setDescription('L\'utente da mutare.')
				.setRequired(true))
		.addStringOption((option:any) =>
			option.setName('durata')
				.setDescription('Il periodo per il timeout.')
				.setRequired(true))
		.addStringOption((option:any) =>
			option.setName('reason')
				.setDescription('La motivazione del timeout.')
				.setRequired(true)),

	// !!! Super importante altrimenti il bot ti da errori come "Undefined" o "Null" !!!
	run: async (interaction: any) => {
		const utente = interaction.options.getUser('utente');
		const durata = interaction.options.getString('durata');
		const reason = interaction.options.getString('reason');
		const user = interaction.guild.members.cache.get(utente.id);
		const log = interaction.guild.channels.cache.get(channels.modsLogs);
		const embed = new MessageEmbed()
			.setTitle('Utente mutato!')
			.setDescription(`L'utente <@!${utente.id}> è stato correttamente mutato per ${durata}.`)
			.setColor('GREEN')
			.setTimestamp()
			.setFooter({ text : interaction.user.tag, iconURL : interaction.user.displayAvatarURL() })
			.addFields({ name : 'Reason', value : reason });
		const embedUser = new MessageEmbed()
			.setTitle('Sei stato mutato!')
			.setDescription(`Oh no! Sei stato mutato per ${durata}.`)
			.setColor('RED')
			.setTimestamp()
			.setFooter({ text : interaction.user.tag, iconURL : interaction.user.displayAvatarURL() })
			.addFields({ name : 'Reason', value : reason });
		if (user.id == interaction.user.id) return interaction.reply({ content :'Non puoi metterti da solo in timeout!', ephemeral : true });
		const time = parseInt(ms(durata));
		if (time > 2419200000 || time < 60000) return interaction.reply({ content : 'Devi specificare un valore tra 1 minuto e 28 giorni. (s - secondi, m - minuti, h - ore, d - giorni)', ephemeral : true });
		if (time) {
			if (user.roles.highest.position < interaction.guild.members.cache.get(interaction.client.user.id).roles.highest.position) {
				user.timeout(time, reason);
				await interaction.reply({ embeds : [embed] });
				await log.send({ embeds : [embed] });
				await user.send({ content : '\n', embeds :[embedUser] });
			}
			else {
				interaction.reply({ content : 'Mi mancano i permessi per farlo.', ephemeral : true });
			}
		}
		else {

			return await interaction.reply({ content : 'Specifica la durata correttamente. (s - secondi, m - minuti, h - ore, d - giorni)', ephemeral : true });
		}

		console.log('Comando /mute eseguito.');
	},
};