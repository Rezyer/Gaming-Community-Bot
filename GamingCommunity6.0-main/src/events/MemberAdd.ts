// Importazioni delle librerie
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js'
import { MessageButtonStyles } from 'discord.js/typings/enums';

// Importazioni delle varie configurazioni
import { channels, roles } from '../config/config.json'

export const MemberAdd = {
	name: 'guildMemberAdd',
	execute(member: any) {
		const canale = member.guild.channels.cache.get(channels.memberCount);
		const canaleWel = member.guild.channels.cache.get(channels.welcome);
		const role = member.guild.roles.cache.get(roles.membro);
		canaleWel.send({ content : `👋 Heilà <@!${member.id}> Benvenuto/a nel server **Gaming Community 6.0**\n\n🤔 Ti ricordiamo di leggere il regolamento in <#${channels.rules}>.\n\n📡 Prenditi anche i ruoli in <#${channels.roles}> per vedere dei canali dei giochi.\n\n📜Siamo alla ricerca di staff! Ti invito a dare un occhio al canale <#${channels.candidature}>!\n\n😁 Buona permanenza!` });
		canale.setName('👫 | Membri : ' + member.guild.memberCount);
		try {
			member.roles.add(role);
		}
		catch {
			const logC = member.guild.channels.cache.get(channels.serverLogs);
			const embed = new MessageEmbed()
				.setTitle(`${member.user.username}#${member.user.discriminator}`)
				.setColor('RED')
				.setDescription(`L'utente <@!${member.id}> non ha ricevuto il ruolo <@!${role.id}>, si prega lo staff di assegnarlo manualmente.`);
			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('bottone')
						.setLabel('Assegna!')
						.setStyle(MessageButtonStyles.DANGER)
						.setDisabled(true),
				);
			logC.send({ content: `<@!${roles.staff}>`, embeds: [embed], components : [row] });
		}
	},
};
