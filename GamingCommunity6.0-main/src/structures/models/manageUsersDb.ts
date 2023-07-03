import { Schema, model } from 'mongoose'

const Myschema = new Schema({

	userID: {
		type: String,
		required: true,
		index: {
			unique: true,
		},
	},

	channelName: {
		type: String,
		required: true,
	},

	roleID: {
		type: String,
		required: true,
	},

	bitrate: {
		type: Number,
		required: true,
	},

	userLimit: {
		type: Number,
		required: true,
		default: 0,
	},
});

module.exports = model('user', Myschema, 'user');