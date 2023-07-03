import { Schema, model } from 'mongoose'
 
const Myschema = new Schema({

	userID: {
		type: String,
		required: true,
		index: {
			unique: true,
		},
	},

	level: {
		type: Number,
		required: true,
		default: 0,
	},

	money: {
		type: Number,
		required: true,
		default: 0,
	},

	xp: {
		type: Number,
		required: true,
		default: 0,
	},
});

module.exports = model('economy', Myschema, 'economy');