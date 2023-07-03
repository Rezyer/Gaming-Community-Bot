// Importazione delle varie librerie
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

// Importazioni delle varie configurazioni
const ManageUsers = require('../../structures/models/manageUsersDb.ts');

// Importazione della struttura del comando
import { Command } from '../../interfaces/Command';

export const v_remkey: Command = {
	data: new SlashCommandBuilder()
		.setName('v_remkey')
		.setDescription('Rimuovi a un utente la chiave del tuo canale.')
		.setDMPermission(false)
		.addUserOption(option =>
			option.setName('target')
				.setDescription('L\'utente a cui andrà rimosso il ruolo.')
				.setRequired(true)),

	// !!! Super importante altrimenti il bot ti da errori come "Undefined" o "Null" !!!
	run: async (interaction: any) => {
		
		await interaction.deferReply();
		let truster: Boolean = false;
		const target = interaction.options.getUser('target');
		const user = interaction.guild.members.cache.get(target.id);
		const usersA = await ManageUsers.find();
		if (user.id == interaction.user.id) return interaction.editReply('Non puoi assegnare il ruolo a te stesso, lo hai già!');
		usersA.forEach((userA: { channelRoleId: Number; roleID: Number; userID: Number; }) => {
			const ruolo = interaction.guild.roles.cache.get(userA.channelRoleId);
			const embed = new MessageEmbed()
				.setTitle('Ruolo rimosso!')
				.setDescription(`Il ruolo <@&${userA.roleID}> è stato correttamente rimosso da <@!${user.id}>`)
				.setColor('RED')
				.setTimestamp();
			if (userA.userID == interaction.user.id) {
				truster = true;
				user.roles.remove(ruolo);
				interaction.editReply({ embeds : [embed] });
				return;
			}
		});
		if (!truster) return await interaction.editReply({ content : 'Non puoi rimuovere un ruolo senza un canale privato!', embeds : [] });
		console.log('Comando /remkey eseguito.');
	},
};