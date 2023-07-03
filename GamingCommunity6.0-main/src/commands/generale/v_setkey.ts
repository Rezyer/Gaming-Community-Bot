// Importazione delle varie librerie
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

// Importazioni delle varie configurazioni
const ManageUsers = require('../../structures/models/manageUsersDb.ts');

// Importazione della struttura del comando
import { Command } from '../../interfaces/Command';

export const v_setkey: Command = {
	data: new SlashCommandBuilder()
		.setName('v_setkey')
		.setDescription('Aggiungi a un utente la chiave del tuo canale.')
		.setDMPermission(false)
		.addUserOption(option =>
			option.setName('target')
				.setDescription('L\'utente a cui andrà assegnato il ruolo.')
				.setRequired(true)),

// !!! Super importante altrimenti il bot ti da errori come "Undefined" o "Null" !!!
run: async (interaction: any) => {
	
		await interaction.deferReply();
		let truster: Boolean = false;
		const target = interaction.options.getUser('target');
		const user = interaction.guild.members.cache.get(target.id);
		const usersA = await ManageUsers.find();
		if (user.id == interaction.user.id) return interaction.editReply('Non puoi assegnare il ruolo a te stesso, lo hai già!');
		usersA.forEach((userA: { roleID: Number; userID: Number; }) => {
			const ruolo = interaction.guild.roles.cache.get(userA.roleID);
			const embed = new MessageEmbed()
				.setTitle('Ruolo assegnato!')
				.setDescription(`Il ruolo <@&${userA.roleID}> è stato correttamente assegnato a <@!${user.id}>`)
				.setColor('GREEN')
				.setTimestamp();
			if (userA.userID == interaction.user.id) {
				truster = true;
				user.roles.add(ruolo);
				interaction.editReply({ embeds : [embed] });
				return;
			}
		});
		if (!truster) await interaction.editReply({ content : 'Non puoi assegnare un ruolo senza un canale privato!', embeds : [] });
		console.log('Comando /setkey eseguito.');
	},
};