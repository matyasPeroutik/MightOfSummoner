const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Summoner } = require("../classes/summoner")
const requests = require('../classes/requests')
const axios = require('axios')

module.exports = {
    /**
     * Object containing command information
     */
    data : new SlashCommandBuilder()
        .setName('mmr')
        .setDescription('Tells you an MMR of a desired summoner!')
        .addStringOption(option => option
            .setName('region')
            .setDescription(`Summoner's region`)
            .setRequired(true)
            .addChoices(
                { name: 'EUNE', value: 'eune'},
                { name: 'EUW' , value: 'euw' }
            ))
        .addStringOption(option => option
            .setName('name')
            .setDescription(`Summoner's name`)
            .setRequired(true)
            ),
        
    /**
     * Function executing the command
     * @param {*} interaction 
     */
    async execute(interaction){
        const region = interaction.options.getString('region')
        const name   = interaction.options.getString('name')

        // Loading player MMR data
        axios.get(`https://${region}.whatismymmr.com/api/v1/summoner?name=${name.replace(' ', '+')}`)
        .then(async res => {
            const data = res.data;

            // Rewrite of 'eune' to 'eun1' due to API structure
            let url_reg = region;
            if(url_reg === 'eune') url_reg = 'eun1';

            // Summoner instance init - Class is holding data about the summoner
            const sum = new Summoner(url_reg, name)

            // Loading player data into the class
            await sum.loadData()

            // Creating description based on loaded data from MMR API
            let desc
            try{
                desc = data['ranked']['summary']
                    .replace(`<b>`, "**")
                    .replace(`</b>`, "**")
                    .replace(`<br><br><span class="symbol--micro"></span>`, `\n`)
                    .replace(`<b>`, "**")
                    .replace(`</b>`, "**")
            }
            catch{
                desc = 'No description found'
            }

            // Adding more fields to the object
            const icoID = await sum.getIconId()
            const icoURL = await requests.getIcon(icoID)
            const embed = new EmbedBuilder()
                .setColor('Aqua')
                .setTitle(name + `'s MMR`)
                .setThumbnail(icoURL)
                .setDescription(desc)
            
                ;

            // Generation of MMR field and adding it to the object
            for ( [key, val] of Object.entries(data) ){
                let mmr;
                try{
                    mmr = val['avg'].toString();
                }
                catch{
                    mmr = 'undefined'
                }
                embed.addFields({ name: key.toUpperCase(), value: mmr , inline: true})
            }

            await interaction.reply({ embeds: [embed] })

        })
        .catch(async err=>{
            console.error('Error: '+err)
            await interaction.reply('Summoner not found !')
        })


    }

}