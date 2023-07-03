// Importazione delle varie librerie
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

// Importazioni delle varie configurazioni
const ManageUsers = require('../../structures/models/manageUsersDb.ts');

// Importazione della struttura del comando
import { Command } from '../../interfaces/Command';

export const v_keylist: Command = {
	data: new SlashCommandBuilder()
		.setName('v_keylist')
		.setDescription('Mostra una lista di persone che hanno accesso al tuo canale.')
		.setDMPermission(false),
	// !!! Super importante altrimenti il bot ti da errori come "Undefined" o "Null" !!!
	run: async (interaction: any) => {

		await interaction.deferReply();
		const usersA = await ManageUsers.find();
		for (const userA of usersA) {
			const users = interaction.guild.roles.cache.get(userA.roleID).members.map((m: { user: { id: any; }; }) => m.user.id);
			let count = 1;
			let string = '';
			users.forEach((user: string) => {
				string += `# ${count} ` + '<@!' + user + '>\n';
				count += 1;
			});
			const embed = new MessageEmbed()
				.setTitle(`Utente: ${interaction.user.username}`)
				.setDescription('Ecco la lista dei membri che hanno il ruolo del tuo canale.')
				.setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
				.setColor('BLUE')
				.setFields(
					{ name : 'Ruolo:', value : `<@&${userA.roleID}>`, inline : true },
					{ name : 'Proprietario:', value : `<@!${userA.userID}>`, inline : true },
					{ name : 'N° Utenti:', value : users.length.toString(), inline : true },
					{ name : 'Lista utenti:', value : string, inline : false })
				.setTimestamp();
			if (userA.userID == interaction.user.id) {
				await interaction.editReply({ content: '\n', embeds : [embed] });
				console.log('Comando /keylist eseguito.');
				break;
			}
			else {
				await interaction.editReply('Non hai un canale, non puoi farlo!');
			}

		}
	},
};