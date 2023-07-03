// Importazioni delle librerie
import { SlashCommandBuilder } from '@discordjs/builders'
import { PermissionFlagsBits } from 'discord-api-types/v10'

// Importazione della struttura del comando
import { Command } from '../../interfaces/Command'

// Importazioni delle varie configurazioni
import { roles } from '../../config/config.json'

export const a_admin: Command = {
	data: new SlashCommandBuilder()
        .setName('a_admin')
        .setDescription('Setta l\'amministratore ad un utente.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addStringOption((option:any) => option.setName('opzione')
            .setDescription('Scegli se rimuovere o aggiungere l\'admin.')
            .setRequired(true)
            .addChoices(
                { name : 'add', value : 'add' },
                { name : 'remove', value : 'rem'}
            ))
        .addUserOption((option: any) => option.setName('utente')
            .setDescription('L\'utente a cui andrà assegnato il ruolo.')
            .setRequired(true)),
    run: async (interaction: any) => {
        const utente = interaction.options.getUser('utente');
        const choice = interaction.options.getString('opzione');
        const user = interaction.guild.members.cache.get(utente.id);
        const ruolo = interaction.guild.roles.cache.get(roles.adminSupp);
        const ver = user.roles.cache.has(ruolo.id);
        if (choice=='add') {
            if (ver) return interaction.reply('Non puoi farlo, l\'utente lo ha già.');
            user.roles.add(ruolo);
            interaction.reply('Ruolo aggiunto!');
        }
        else if (choice=='rem') {
            if (!ver) return interaction.reply('Non puoi farlo, l\'utente non lo ha già.');
            user.roles.remove(ruolo);
            interaction.reply('Ruolo rimosso!');
        } 
    }
};