// Importazioni delle librerie
import { SlashCommandBuilder } from '@discordjs/builders'
import { PermissionFlagsBits } from 'discord-api-types/v10'

// Importazioni delle varie configurazioni
import { channels } from '../../config/config.json' 
import { Command } from '../../interfaces/Command'

// Formato del codice
export const dev_agg: Command = {
	data: new SlashCommandBuilder()
		.setName('dev_agg')
		.setDescription('Aggiorna le impostazioni del server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setDMPermission(false),

		// !!! Super importante altrimenti il bot ti da errori come "Undefined" o "Null" !!!
		run: async (interaction: any) => {

		const Canale = interaction.guild.channels.cache.get(channels.memberCount);

		interaction.reply({ content : 'Canale correttamente aggiornato!', ephemeral : true });

		Canale.setName('👫 | Membri : ' + interaction.guild.memberCount);

		console.log('Comando /agg eseguito.');
		},
	};