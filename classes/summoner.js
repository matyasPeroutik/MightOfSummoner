const { get }  = require('./requests')

module.exports = {
    Summoner: class Summoner {

        constructor(region, name){
            this.name = name;
            this.region = region;
        }

        async loadData(){
            const url_name = this.name.replace(' ', '%20')
            this.data =await get(`https://${this.region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${url_name}?api_key=${process.env.LOL_API_KEY}`)
        }

        async getLevel(){
            return this.data['summonerLevel']
        }

        async getIconId(){
            return this.data['profileIconId']
        }
    }
}