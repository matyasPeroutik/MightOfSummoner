const { SlashCommandBuilder,  EmbedBuilder } = require('discord.js');
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

/**
 * Module containing Music-Player RESUME command.
 * 
 * This command pauses the player
 */
module.exports = {
    /**
     * Object containing command information
     */
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the song"),
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
        /**
         * Get the GuildQueuePlayerNode object from queue
         * @description at https://discord-player.js.org/docs/classes/discord-player/GuildQueuePlayerNode#public-getdurationmultiplier-number
         */
        let qnode = queue.node

        // If the player is paused, dont pause it again
        if (qnode.isPlaying()) return interaction.reply('The song is already playing. Use command `/pause` to pause the song')

        // Resume the player
        qnode.resume()
        interaction.reply(`Resumed at ${qnode.getTimestamp()['current']['label']}/${qnode.getTimestamp()['total']['label']}`)
    }

}