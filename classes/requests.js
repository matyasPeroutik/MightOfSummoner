const axios = require('axios')

module.exports = {
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

    async getDdragonVersion(){
        try{
            const data = await this.get('https://ddragon.leagueoflegends.com/api/versions.json')
            return data[0]
        }
        catch{
            return '12.17.1'
        }
        
    },

    async getIcon(iconID){
        const version = await this.getDdragonVersion()
        return `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${iconID}.png`

    }
}