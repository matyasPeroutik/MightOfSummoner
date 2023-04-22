const axios = require('axios')

module.exports = {

    /**
     * Function that pulls data from a request
     * @param {String} url Url containing desired data
     * @returns {Object} Requested data
     */
    get(url){
        data = []
        return new Promise((resolve, reject) => {
            axios.get(url)
            .then(res => {
                for(const [key, value] of Object.entries(res.data)){
                    data[key] = value;
                }
                resolve(data);
            })
            .catch(err => {
                reject(err)
            })
        })
    },

    /**
     * Gets current DDragon Version
     * @returns {String} Current DDragon version
     */
    async getDdragonVersion(){
        try{
            const data = await this.get('https://ddragon.leagueoflegends.com/api/versions.json')
            return data[0]
        }
        catch{
            return '12.17.1'
        }
        
    },


    /**
     * Get's URL page of icon associated with the summoner
     * @param {Number | String} iconID 
     * @returns 
     */
    async getIcon(iconID){
        const version = await this.getDdragonVersion()
        return `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${iconID}.png`

    }
}