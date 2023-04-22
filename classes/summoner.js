const { get }  = require('./requests')

module.exports = {

    /** Class representing a summoner (League of Legends account) */
    Summoner: class Summoner {

        /**
         * Class constructor
         * @param {String} region Summoner's region
         * @param {String} name   Summoner's name
         */
        constructor(region, name){
            this.name = name;
            this.region = region;
        }

        /**
         * Function used to load data from Riot API to the class
         * @returns {Promise} Data
         */
        async loadData(){
            const url_name = this.name.replace(' ', '%20')
            this.data =await get(`https://${this.region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${url_name}?api_key=${process.env.LOL_API_KEY}`)
        }

        /**
         * Function which returns loaded summoner data. Needs to be used after loadData() function.
         * @returns {Object} data
         */
        async getLevel(){
            return this.data['summonerLevel']
        }

        /**
         * Function which returns summoner icon id. Needs to be used after loadData() function.
         * @returns {Object} profileIconID
         */
        async getIconId(){
            return this.data['profileIconId']
        }
    }
}