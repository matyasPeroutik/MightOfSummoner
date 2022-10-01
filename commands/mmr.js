const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Summoner } = require("../classes/summoner")
const requests = require('../classes/requests')
const axios = require('axios')

module.exports = {
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
        
    
    async execute(interaction){
        const region = interaction.options.getString('region')
        const name   = interaction.options.getString('name')

        // Ziskani dat ohledne hracova MMR
        axios.get(`https://${region}.whatismymmr.com/api/v1/summoner?name=${name.replace(' ', '+')}`)
        .then(async res => {
            const data = res.data;

            // Uprava regionu EUNE na EUN1, kvuli API
            let url_reg = region;
            if(url_reg === 'eune') url_reg = 'eun1';

            //Vytvoreni classy summoner (../classes/summoner.js)
            const sum = new Summoner(url_reg, name)

            // Load dat z duvodu PROMISSE
            await sum.loadData()

            // UPRAVA Description
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

            const icoID = await sum.getIconId()
            const icoURL = await requests.getIcon(icoID)
            const embed = new EmbedBuilder()
                .setColor('Aqua')
                .setTitle(name + `'s MMR`)
                .setThumbnail(icoURL)
                .setDescription(desc)
            
                ;

            // Generace fieldu na zaklade dat z MMR stranky co nasel Vitek
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