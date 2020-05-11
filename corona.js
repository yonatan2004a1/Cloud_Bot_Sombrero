const fetch = require('node-fetch');
async function GetCoronaStats()
{
    return await new Promise((resolve, reject) => {
    fetch("https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/total?country=Israel", {
    	"method": "GET",
    	"headers": {
    		"x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
    		"x-rapidapi-key": "f7b316f98bmsh4aaf522c88b3ff3p1d31fdjsn50a63e0c8625"
    	}
    })
    .then(res => {
        if(!res.ok)
            throw "Error: "+res.statusText;
        return res.json();
    })
    .then(data => {
        let corona = data.data;
        resolve([corona.confirmed ,corona.recovered, corona.deaths]);
    })
    .catch(err => {
	    reject(err);
    });
    })
}
module.exports = {
    GetCoronaStats
}