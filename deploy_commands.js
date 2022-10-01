const { REST, SlashCommandBuilder, Routes } = require('discord.js');
require('dotenv').config()

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!')
].map(command => command.toJSON())

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);


rest.put(Routes.applicationGuildCommands
        (process.env.BOT_ID, process.env.DEV_SERVER_ID),
        { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);