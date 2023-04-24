const { SlashCommandBuilder } = require('discord.js');

/**
 * Module containing ping command.
 * 
 * This is just a basic communication test command.
 * 
 * @todo - Remove it on release
 */
module.exports = {
	/**
     * Object containing command information
     */
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),

	/**
	 * Function executing the command
	 * @param {*} interaction 
	 */
	async execute({client, interaction}) {
		await interaction.reply('Pong!');
	},
};
