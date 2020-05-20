const fetch = require('node-fetch');
async function GetCoronaStats(state)
{
    return await new Promise((resolve, reject) => {
    let args = state.split(" ");
    console.log("arr:");
    console.log(args);
    var formattedState = "";
    for(let i=0;i<args.length;i++)
    {
        formattedState+=args[i].substr(0,1).toUpperCase()+state.substr(1).toLowerCase();
    }
    console.log("decoded: "+formattedState);
    formattedState = encodeURI(formattedState);
    console.log("encoded:"+formattedState);
    fetch(`https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/total?country=${formattedState}`, {
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