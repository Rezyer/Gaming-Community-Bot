// Importazione delle varie librerie
import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { MessageEmbed } from 'discord.js';

// Importazioni delle varie configurazioni
import { roles } from '../../config/config.json'
const ManageUsers = require('../../structures/models/manageUsersDb.ts');

// Importazione della struttura del comando
import { Command } from '../../interfaces/Command';


export const s_manage: Command = {
	data: new SlashCommandBuilder()
		.setName('s_manage')
		.setDescription('Aggiorna i set del database.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setDMPermission(false)
		.addSubcommand((subcommand:any) =>
			subcommand.setName('users')
				.setDescription('Il file users.')
				.addStringOption((option:any) =>
					option.setName('azione')
						.setDescription('L\'azione da eseguire.')
						.setRequired(true)
						.addChoices(
							{ name : 'add', value : 'new' },
							{ name : 'remove', value : 'rem' },
						))
				.addUserOption((option:any) =>
					option.setName('utente')
						.setDescription('L\'utente selezionato.')
						.setRequired(true))),

	// !!! Super importante altrimenti il bot ti da errori come "Undefined" o "Null" !!!
	run: async (interaction: any) => {

		if (interaction.options.getSubcommand() === 'users') {
			const azione = interaction.options.getString('azione');
			const userO = interaction.options.getUser('utente');
			const user = interaction.guild.members.cache.get(userO.id);
			if (azione == 'new') {
				const utente = await ManageUsers.findOne({ userID: user.id });
				if (utente) return interaction.reply({ content : 'L\'utente è già nel database.', ephemeral : true });
				const filter = (m: { author: { id: any; }; }) => interaction.user.id === m.author.id;
				let nomeCanale: any = '';
				let bitrate: any = '';
				let bitrateKb: any = '';
				let nomeRuolo: any = '';
				let ruolo: any = '';
				let embed: any = '';
				await interaction.reply({ content : 'Inserisci il nome del canale. (All\'inizio sarà cmq presente 🎧│)', ephemeral : true });
				await interaction.channel.awaitMessages({ filter, time: 60000, max: 1, errors: ['time'] })
					.then((msg: { first: () => { (): any; new(): any; content: string; }; }) => {
						nomeCanale = '🎧│' + msg.first().content;
						nomeRuolo = msg.first().content + '\'s Key';
						interaction.followUp({ content : 'Ora inserisci il bitrate. (Tra 8 e 96)', ephemeral : true });
					})
					.catch((error: any) => {
						console.error(error);
						return interaction.followUp({ content : 'Non hai inserito nulla, riprova!', ephemeral : true });
					});
				await interaction.channel.awaitMessages({ filter, time: 60000, max: 1, errors: ['time'] })
					.then(async (msg: { first: () => { (): any; new(): any; content: string; }; }) => {
						bitrate = msg.first().content;
						bitrateKb = msg.first().content;
						bitrate += '000';
						bitrate = parseInt(bitrate);
						if (bitrate > 96000 || bitrate < 8000) return interaction.followUp({ content : 'Non puoi inserire un numero non compreso tra 8 e 96.', ephemeral : true });
						await interaction.followUp({ content : 'Sto creando il ruolo e aggiornando il database, attendi.', ephemeral : true });
						await interaction.guild.roles.create({
							name : nomeRuolo,
							reason : 'Nuova chiave creata!',
							position : interaction.guild.roles.cache.get(roles.keysBannerRole).position,
						});
						ruolo = await interaction.guild.roles.cache.find((r: { name: string; }) => r.name === nomeRuolo);
						await user.roles.add(ruolo.id);
						embed = new MessageEmbed()
							.setTitle('Azione riuscita!')
							.setDescription('Il settaggio è andato a buon fine, il canale è pronto per ricevere l\'utente.')
							.setColor('GREEN')
							.setTimestamp()
							.setFields(
								{ name : 'Ruolo', value : `<@&${ruolo.id}>`, inline : true },
								{ name : 'Owner Canale', value : `<@!${user.id}>`, inline : true },
								{ name : 'Nome Canale', value : nomeCanale, inline : false },
								{ name : 'Bitrate', value : `${bitrateKb}Kb/s`, inline : true },
							);
					})
					.catch((error: any) => {
						console.error(error);
						return interaction.followUp({ content : 'Non hai inserito nulla, riprova!', ephemeral : true });
					});
				try {
					await ManageUsers.create({
						userID: user.id,
						channelName: nomeCanale,
						roleID: ruolo.id,
						bitrate: bitrate,
						userLimit: 0,
					});
					await interaction.followUp({ embeds : [embed] });
				}
				catch {
					await interaction.followUp({ content : 'C\'è stato un problema con l\'aggiornamento del database.', ephemeral : true });
				}
			}
			else if (azione == 'rem') {
				const utente = await ManageUsers.findOne({ userID: user.id });
				if (!utente) return interaction.reply({ content : 'L\'utente non è nel database.', ephemeral : true });
				const ruolo = await interaction.guild.roles.cache.get(utente.roleID);
				await ruolo.delete();
				await ManageUsers.deleteOne({ userID: user.id });
				const embedF = new MessageEmbed()
					.setTitle('Azione riuscita!')
					.setDescription('Il settaggio è andato a buon fine, il ruolo è stato correttamente rimosso')
					.setColor('RED')
					.setTimestamp()
					.setFields(
						{ name : 'Utente', value : `<@!${user.id}>`, inline : true },
					);
				interaction.reply({ content : '\n', embeds : [embedF] });
			}
		}


		console.log('Comando /manage eseguito.');
	},
};