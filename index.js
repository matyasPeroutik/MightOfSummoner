const { Client, GatewayIntentBits} = require('discord.js')
const fs = require('fs');
require('dotenv').config()

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const comList = {}

fs.readdir('./commands', (err, filenames) => {
    if(err){
        console.error(err);
        return;
    }

    filenames.forEach(element => {
        
        comList[element.substring(0, element.length - 3)] = require('./commands/ping').command
    });
})

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
    try{
        await comList[commandName](interaction);
    }
    catch(e){
        console.error(e)
        await interaction.reply('An error has occured on server side of the bot. I apologize for this.')
    }
})


// Login to Discord with your client's token
client.login(process.env.TOKEN);