const fetch = require('node-fetch');
async function GetCoronaStats(state)
{
    return await new Promise((resolve, reject) => {
    state = state.slice(0,1).toUpperCase()+state.slice(1,state.length).toLowerCase();
    state = encodeURI(state);
    fetch(`https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/total?country=${state}`, {
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
        if(data.message.includes('Country not found'))
            throw "Error: Country not found";
        let corona = data.data;
        resolve([corona.confirmed ,corona.recovered, corona.deaths, corona.location]);
    })
    .catch(err => {
	    reject(err);
    });
    })
}
module.exports = {
    GetCoronaStats
}