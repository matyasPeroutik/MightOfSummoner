const { SlashCommandBuilder,  EmbedBuilder } = require('discord.js');
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

/**
 * Module containing Music-Player PLAY command.
 * 
 * This command joins the bot into the channel and plays desired song
 * 
 * 
 */
module.exports = {
    /**
     * Object containing command information
     */
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stops the player, deleting the queue in the process"),
    /**
     * Function executing the command
     * @param {*} interaction 
     */
    async execute({client, interaction }){
        
        // Check, if interaction author is in a voice chat
        if (!interaction.member.voice.channel) return interaction.editReply("You need to be in a VC to use this command")

        // Get queue for current server from player object
        let queue = client.player.queues.get(interaction.guildId)

        // If the queue is empty, notify user about it
        if (queue === null) return interaction.reply('Nothing is being played')

        // Delete the queue -> automatic disconnect
        queue.delete()
        interaction.reply('Stopped playing')
    }

}