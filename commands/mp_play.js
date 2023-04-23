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
    .setName("play")
    .setDescription("loads songs from youtube")
    .addSubcommand((subcommand) =>
        subcommand
            .setName("song")
            .setDescription("Loads a single song from a url")
            .addStringOption((option) => option.setName("search").setDescription("the song's url or search term").setRequired(true))
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("playlist")
            .setDescription("Loads a playlist of songs from a url")
            .addStringOption((option) => option.setName("url").setDescription("the playlist's url").setRequired(true))
    ),
    
    /**
	 * Function executing the command
	 * @param {*} interaction 
	 */
    async execute({client, interaction }){

        // Check, if interaction author is in a voice chat
        if (!interaction.member.voice.channel) return interaction.editReply("You need to be in a VC to use this command")

        // Preparation of EmbedBuilder object for output message
		let embed = new EmbedBuilder()

        /**
         * Song subcommand implementation
         * Searches youtube for the song by URL and it assert's it to the playlist
         */
		if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("search")

            // Load SearchResult data of the query
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            // If no data found
            if (result.tracks.length === 0)
                return interaction.reply("No results")

            // Grab the first result
            let song = result.tracks[0]

            // Play the song -> last place on the Queue
            client.player.play(interaction.member.voice.channel, song)

            // Edit the embed
            embed
            .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Duration: ${song.duration}`})
		} 
        else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url")

            // Load SearchResult data of the query
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            // If no data found
            if (result.tracks.length === 0)
                return interaction.reply("No results")

            // Grab the first result
            
            let pl = result.playlist
            if (pl.tracks.length === 0) return nteraction.reply("No songs in playlist")

            // Play the playlist -> last place on the Queue
            client.player.play(interaction.member.voice.channel, pl)

            // Create list of 5 songs
            let amnt = 5
            if (pl.tracks.length < amnt) amnt = pl.tracks.length
            
            // Generate track list to show on the output
            let songs = pl.tracks.splice(0, amnt-1)
            let songsStr = ""
            songs.forEach(song => {
                console.log(song)
                songsStr += '\t' + song.raw.title + '\n'
            })

            // If there are more than 5 songs in the playlist
            if(pl.tracks.length > 5) songsStr += `\t ... and ${pl.tracks.length-5} more songs!!`
            

            // Edit the embed
            embed
            .setDescription(`**[${pl.title}](${pl.url})** has been added to the Queue\n`)
            .setThumbnail(pl.thumbnail.url)
            .setFooter({ text: `Tracks:\n ${songsStr}`})
		} 

        // Send the reply
        await interaction.reply({
            embeds: [embed]
        })
    }
}