const { SlashCommandBuilder,  EmbedBuilder } = require('discord.js');
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

/**
 * Module containing Music-Player QUEUE command.
 * 
 * This command shows the queue
 */
module.exports = {
    /**
     * Object containing command information
     */
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Displays the queue")
        .addIntegerOption((option) => option.setName("page").setDescription("Which page to show").setRequired(false)),
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

        // Embed builder
        let embed = new EmbedBuilder()
        
        // Setting up variables
        let qnode = queue.node
        let qlen = queue.size
        let param = interaction.options.getInteger('page')
        let songs = queue.tracks.data
        let songsStr = ""

        // Pagination implementation
        if(param === null) param = 1
        if(param > qlen/10) param = Math.ceil(qlen/10)
        if(qlen > 10) songs = songs.splice(10*(param-1), 10)

        // Generating page 
        for(var i = 0; i < songs.length; i++){
            songsStr += `${10*(param-1)+i+1}.   \t` + `[${songs[i].title}](${songs[i].url})` + '\n'

        };

        // If there is nothing to show
        if(param === 0) songsStr = "The queue is empty. Nothing to see here :P"

        // Return the Embed
        embed
            .setDescription(`**Playing now: [[${queue.currentTrack.title}](${queue.currentTrack.url})]**\n
            Time:  ${qnode.getTimestamp()['current']['label']}/${qnode.getTimestamp()['total']['label']}\n\n
            **CURRENT QUEUE** (page ${param} of ${Math.ceil(qlen/10)})\n
            Tracks:\n ${songsStr}`)
            .setThumbnail(queue.currentTrack.thumbnail)

        await interaction.reply({
            embeds: [embed]
        })    
    }

}