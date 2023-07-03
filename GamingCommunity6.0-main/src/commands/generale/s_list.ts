// Importazione delle varie librerie
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

// Importazioni delle varie configurazioni
import { roles } from '../../config/config.json'

// Importazione della struttura del comando
import { Command } from '../../interfaces/Command';

// Formato del codice
export const s_list: Command = {
	data: new SlashCommandBuilder()
		.setName('s_list')
		.setDescription('Mostra la lista di tutto lo staff')
		.setDMPermission(false),
	
	// !!! Super importante altrimenti il bot ti da errori come "Undefined" o "Null" !!!
	run: async (interaction: any) => {
		const staffL = interaction.guild.roles.cache.get(roles.staff).members.map((m: { user: { id: any; }; }) => m.user.id);
		let stringa = '' ;
		let count = 1;
		staffL.forEach((staff: any) => {
			stringa += `# ${count} <@!${staff}>\n`;
			count += 1;
		});
		const embed = new MessageEmbed()
			.setTitle('Lista Staff')
			.setDescription('Qui sotto vi è la lista dello staff, per avere più dettagli clicca il link.')
			.addFields({ name : 'Membri:', value : stringa, inline : true })
			.setFooter({ text : interaction.user.tag, iconURL : interaction.user.displayAvatarURL() })
			.setTimestamp()
			.setURL('https://URL-lista-staff.example');
		await interaction.reply({ embeds : [embed] });
		console.log('Comando /stafflist eseguito.');
	},
};