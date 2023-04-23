/**
 * 	THE MIGHT OF SUMMONER DISCORD BOT (TMOS)
 * 	Author: Matyáš Peroutík (https://github.com/matyasPeroutik)
 * 	Version: 0.0.1 (Developement)
 * 
 * This is a rewrite of already existing discord bot to JS.
 * Rewrite was needed due to discord's changes, becouse you need to use
 * slash command now.
 * 
 * This program is for Personal use only
 */

const { Client, Collection, GatewayIntentBits} = require('discord.js')
const fs = require('node:fs');
const path = require('node:path');
const { Player } = require("discord-player")
require('dotenv').config()

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute({client, interaction});
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);