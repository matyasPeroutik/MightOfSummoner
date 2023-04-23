const { SlashCommandBuilder,  EmbedBuilder } = require('discord.js');
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

/**
 * Module containing Music-Player PAUSE command.
 * 
 * This command pauses the player
 */
module.exports = {
    /**
     * Object containing command information
     */
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the song"),
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
        if (qnode.isPaused()) return interaction.reply('It is already paused. Use command `/resume` to resume playing')

        // Pause the player
        qnode.pause()
        interaction.reply(`Paused at ${qnode.getTimestamp()['current']['label']}/${qnode.getTimestamp()['total']['label']}`)
    }

}