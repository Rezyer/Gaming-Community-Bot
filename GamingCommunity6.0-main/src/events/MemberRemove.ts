// Importazioni delle varie configurazioni
import { channels } from '../config/config.json'

export const MemberRemove = {
	name: 'guildMemberRemove',
	execute(member: any) {
		const canale = member.guild.channels.cache.get(channels.memberCount);
		canale.setName('👫 | Membri : ' + member.guild.memberCount);
	},
};