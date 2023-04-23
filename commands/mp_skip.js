const { SlashCommandBuilder,  EmbedBuilder } = require('discord.js');
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

/**
 * Module containing Music-Player SKIP command.
 * 
 * This skips next or n songs
 */
module.exports = {
    /**
     * Object containing command information
     */
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current the song")
        .addIntegerOption((option) => option.setName("amm").setDescription("How many songs to skip").setRequired(false)),
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

        // Node initialization
        let qnode = queue.node

        // Skip location calculations
        let param = interaction.options.getInteger('amm')
        if(param === null) qnode.skip()
        else {
            if(param < queue.size) qnode.skipTo(param-1)
            else qnode.skipTo(queue.size-1)
        }

        // Reply
        if(queue.size !== 0) return interaction.reply(`Skipped to ${queue.tracks.data[0].title}`)
        return interaction.reply(`Skipped`)
    }

}