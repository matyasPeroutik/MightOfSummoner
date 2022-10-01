const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Deletes last <number> messages from the channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages, PermissionFlagsBits.Administrator)
        .addIntegerOption(option => option.setName('ammount').setDescription('Ammount of messages to be cleared').setRequired(true).setMaxValue(100).setMinValue(1)),

	async execute(interaction) {
        const messageAmmount = interaction.options.getInteger('ammount')
        console.log(messageAmmount)
		await interaction.channel.bulkDelete(messageAmmount, true);
        await interaction.reply(`${messageAmmount} messages has been vaporized, or atleast has been attempted to.`)
	},
};
