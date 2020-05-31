/*const  fivem  =  require("fivem-api");
 
fivem.getServerInfo("94.33.52.123:30120").then((server)  =>  console.log(server.players.name))
*/

const fetch = require('node-fetch');
async function GetServer(serverIP)
{
    return await new Promise((resolve, reject) => {
        fetch(`http://${serverIP}/players.json`, {
	        "method": "GET",
        })
        .then(response => {
            if(!response.ok)
            {
                throw "Error Unkown";
            }
            return response.json();
        })
        .then(data => {
            //let vars = data.vars;
            let players = data.length
            resolve(players);
        })
        .catch(err => {
            reject (err);
        });
    })
}
GetServer().then(console.log)
module.exports = {
    GetServer
}