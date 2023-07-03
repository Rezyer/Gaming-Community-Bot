// Importazioni delle librerie
import TempChannels from 'discord-temp-channels'
import { Client } from 'discord.js'

// Importazioni delle varie configurazioni
import { channels, categorie, perms} from '../config/config.json'
const ManageUsers = require('../structures/models/manageUsersDb');

export function Temp(client:any) {
const TP = new TempChannels(client)
	
	
TP.registerChannel(channels.privateCreate, { // ?Registrazione
	childFormat: (member) => `🎧 | ${member.user.username}'s Channel`,
	childCategory: categorie.privateCreate,
	childAutoDeleteIfEmpty: true,
	childAutoDeleteIfOwnerLeaves: false,
	childMaxUsers: 5,
	childBitrate: 64000,
});
// *Anime Channel
TP.registerChannel(channels.animeCreate, { // ?Registrazione
	childFormat: (count) => `🌸│Anime WT #${count}`,
	childCategory: categorie.animeCreate,
	childAutoDeleteIfEmpty: true,
	childAutoDeleteIfOwnerLeaves: false,
	childMaxUsers: 5,
	childBitrate: 96000,
});
TP.on('childCreate', async (member, channel) => { // ?Editing
	const usersA = await ManageUsers.find();
	usersA.forEach(async (userA: { userID: String; channelName: String; roleID: String; userLimit: Number; bitrate: Number; }) => {
		if (channel.parentId == categorie.privateCreate) {
			if (member.user.id == userA.userID) {
				await channel.setName(userA.channelName);
				await channel.permissionOverwrites.edit(userA.roleID, perms.keys);
				await channel.setUserLimit(userA.userLimit);
				await channel.setBitrate(userA.bitrate);
			}
		}
	});
});

}