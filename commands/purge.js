const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

/**
 * Module containing Purge command
 * 
 * The command deletes a certain ammount of messages. 
 * It is needed to have Administrator rigts to be able to execute the command
 */
module.exports = {
	/**
     * Object containing command information
     */
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Deletes last <number> messages from the channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages, PermissionFlagsBits.Administrator)
        .addIntegerOption(option => option.setName('ammount').setDescription('Ammount of messages to be cleared').setRequired(true).setMaxValue(100).setMinValue(1)),

	/**
	 * Function executing the command
	 * @param {*} interaction 
	 */
	async execute({client, interaction}) {
        const messageAmmount = interaction.options.getInteger('ammount')
		await interaction.channel.bulkDelete(messageAmmount, true);
        await interaction.reply(`${messageAmmount} messages has been vaporized, or atleast has been attempted to.`)
	},
};
