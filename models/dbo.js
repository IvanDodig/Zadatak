const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dboSchema = new Schema({
	ime: {
		type: String,
		required: true,
	},
	prezime: {
		type: String,
		required: true,
	},
	postanskiBr: {
		type: String,
		required: true,
	},
	grad: {
		type: String,
		required: true,
	},
	telefon: {
		type: String,
		required: true,
	},
});

const Dbo = mongoose.model("Dbo", dboSchema);
module.exports = Dbo;
