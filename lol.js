const fetch = require("node-fetch");
const apiDir = ".api.riotgames.com/lol/" //we will always use this url part (there are stuff like /tft/ but we dont work on it)
const key = '?api_key=RGAPI-3f2fdd29-ccb2-4b99-b483-ead21450e0c4';
// ====== PRIVATE FUNCTIONS, WILL NOT BE EXPORTED ======
async function GetLatestDDragonVer()
{
    let url = 'https://ddragon.leagueoflegends.com/api/versions.json';
    return await fetch(url)
    .then(res => res.json())
    .then(data => {
        return data[0];
    })
}
async function GetID(name, region) 
{
    let endcodedUri = encodeURI(name);
    let url = `https://${region + apiDir}summoner/v4/summoners/by-name/${endcodedUri + key}`; //crafts the url for user info by name
        return await new Promise(async(resolve, reject) => { //makes a new promise with resolve and reject
        await fetch(url)
        .then(res => {
            if(!res.ok) {
                reject(res.status) //rejects when ok is false, meaning when fetch encounters an error
            }
            return res.json();
            })
        .then((data) => {
            resolve([data.id, data.name, data.profileIconId]); //resovles the data in an array of the id (0) and name (1)
        })
    })
}
async function GetRankAndTier(id, region)
{
    let url = `https://${region + apiDir}league/v4/entries/by-summoner/${id + key}`; //crafts the url for rank by id
    return await fetch(url)
    .then(res => res.json())
    .then(data => {
        if(data[0] == undefined) //unranked returns an empty array
        {
            return "Unranked"; 
        }
        let place = 0;
        if(data[0].queueType != 'RANKED_SOLO_5x5') //sometimes the api returns solo as [0] and sometimes [1], so we make sure its the right array
            place = 1;
        return data[place].tier + ' ' + data[place].rank;
    })
} 
function GetRegion(region) 
{
    switch(region = region.toLowerCase())
    {
        case "eun1":
        case "eune":
            return "EUN1";
        case "euw":
        case "euw1":
            return "EUW1";
        case "na":
        case "na1":
            return "NA1";
        default:
            return null; //if the function returns null the inputted region is unsupported (no reason to) or badly inputted
    }
}
// ====== PUBLIC FUNCTIONS, AVILABLE TO USE ======
/**
 * Input: user input of name and region.
 * 
 * Output: in-game official name (how the name really looks) and rank. Data is string[name, rank]
 * 
 * Exception: bad region or name input (goes to catch)
 * @param {string} name 
 * @param {string} region 
 */
async function GetUsernameAndRank(name, region) {
    return await new Promise((resolve, reject) => {
        region = GetRegion(region);
        if(region == null)
            reject("Region not found");
        GetID(name, region)
        .then(data => {
            let username = data[1];
             GetRankAndTier(data[0], region)
            .then(data => {
                resolve([username, data]);
            })
        })
        .catch(err => {
            reject(err);
        })
    })
}
async function GetProfileIconURL(name, region)
{
    region = GetRegion(region);
    return await GetID(name, region)
    .then(async(data) => {
        return await GetLatestDDragonVer()
        .then(ver => `http://ddragon.leagueoflegends.com/cdn/${ver}/img/profileicon/${data[2]}.png`)
    })

}
module.exports = {
    GetUsernameAndRank,
    GetProfileIconURL
}