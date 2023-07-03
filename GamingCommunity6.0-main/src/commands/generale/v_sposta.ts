// Importazione delle varie librerie
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

// Importazioni delle varie configurazioni
import { channels } from '../../config/config.json'

// Importazione della struttura del comando
import { Command } from '../../interfaces/Command';

export const v_sposta: Command = {
	data: new SlashCommandBuilder()
		.setName('v_sposta')
		.setDescription('Sposta un utente dal canale spostami a quello in cui si è.')
		.setDMPermission(false)
		.addUserOption(option =>
			option.setName('utente')
				.setDescription('L\'utente da spostare.')
				.setRequired(true),
		),

// !!! Super importante altrimenti il bot ti da errori come "Undefined" o "Null" !!!
run: async (interaction: any) => {

		const utente = interaction.options.getUser('utente');
		const author = interaction.member.guild.members.cache.get(interaction.user.id);
		const canale = author.voice.channel;
		const target = interaction.member.guild.members.cache.get(utente.id);
		const embed = new MessageEmbed()
			.setTitle('Utente correttamente spostato!')
			.setDescription(`L'utente <@!${utente.id}> è stato correttamente spostato in ${canale.name}`)
			.setColor('GREEN')
			.setTimestamp();
		// const spostami = interaction.guild.channels.cache.get(canaleSpostami);
		if (!author.voice.channel) return interaction.reply({ content : 'Entra in un canale vocale prima!', ephemeral : true });
		if (interaction.user.id == target.id) return interaction.reply({ content : 'Non puoi spostare te stesso!', ephemeral : true });
		if (!target.voice.channel) return interaction.reply({ content : `L'utente non è in un canale vocale, fallo entrare in <#${channels.spostami}>.`, ephemeral : true });
		if (target.voice.channel.id != channels.spostami) return interaction.reply({ content : `L'utente non è nel canale <#${channels.spostami}>, fallo entrare.`, ephemeral : true });
		// console.log(target.voice.channel);
		target.voice.setChannel(canale);
		interaction.reply({ embeds : [embed] });
		console.log('Comando /sposta eseguito.');
	},
};