const fetch = require("node-fetch");
const apiDir = ".api.riotgames.com/lol/" //we will always use this url part (there are stuff like /tft/ but we dont work on it)
global.Headers = fetch.Headers;
// ====== PRIVATE FUNCTIONS, WILL NOT BE EXPORTED ======
async function GetMMR(name, region) //only supports na, eu(both). insert the OFFICIAL username
{
    /*
    MMR calculation by WhatIsMyMMR.com
    License: Creative Commons Attribution 2.0 Generic
    https://dev.whatismymmr.com/
    */
    name = name.replace(' ', '+');
    region = GetRegion(region, true);
    let url = `https://${region}.whatismymmr.com/api/v1/summoner?name=${name}`;
    let headers = new Headers({
        "User-Agent" : "DiscordBot:Sombrero Guy:v1.0"
    });
    return await new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: headers
        })
        .then(res => {
            if(!res.ok)
                throw "API error msg NotUnique ty";
            return res.json();
        })
        .then(data => {
            let mmr = data.ranked.avg || "Unavailable"; 
            resolve(mmr); //if mmr is null returns "unavailable"
        })
        .catch(err => {
            reject(err);
        });
    })
}
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
    let url = `https://${region + apiDir}summoner/v4/summoners/by-name/${endcodedUri + process.env.RIOT_GAMES_API_KEY}`; //crafts the url for user info by name
        return await new Promise(async(resolve, reject) => { //makes a new promise with resolve and reject
        await fetch(url)
        .then(res => {
            if(!res.ok) { //rejects when ok is false, meaning when fetch encounters an error
                switch(res.status)
                {
                    case 404:
                        reject("Summoner not found");
                        break;
                    case 403:
                        reject("Key expired msg @NotUnique lol");
                        break;
                    default:
                        reject("Unknown");
                        break;
                } 
            }
            return res.json();
            })
        .then((data) => {
            resolve([data.id, data.name, data.profileIconId, data.summonerLevel]); //resovles the data in an array of the id (0) and name (1)
        })
    })
}
async function GetRankAndTier(id, region) //WILL ALWAYS RETURN SOLO DUO AS [0] AND FLEX AS [1] (UNLIKE RIOT)
{
    let url = `https://${region + apiDir}league/v4/entries/by-summoner/${id + process.env.RIOT_GAMES_API_KEY}`; //crafts the url for rank by id
    return await fetch(url)
    .then(res => res.json())
    .then(data => {
        if(data[0] == undefined)
        {
            let obj = {
                rank: "Unranked",
                games: "",
                winRate: ""
            };
            return [obj, obj];
        }

        let ranks = [];
        if(data.length == 1)
        {
            let games = data[0].wins + data[0].losses; // total played games
            let winRate = ((data[0].wins/games) * 100).toFixed(0); // win rate
            let obj = {
                rank: data[0].tier + ' ' +data[0].rank + ', ' + data[0].leaguePoints + 'LP',
                games: 'Wins: '+data[0].wins + ' Losses: ' + data[0].losses,
                winRate: `Win Ratio: ${winRate}%`
            };
            let obj1 = {
                rank: "Unranked",
                games: "",
                winRate: ""
            };
            if(data[0].queueType == "RANKED_SOLO_5x5")
            {
                ranks.push(obj);
                ranks.push(obj1);
            }
            else
            {
                ranks.push(obj1);
                ranks.push(obj);
            }
            return ranks;
        }
        else
        {
            let games = data[0].wins + data[0].losses; //solo/duo total played games
            let games1 = data[1].wins + data[1].losses; //flex 5v5 total played games
            let winRate = ((data[0].wins/games) * 100).toFixed(0); //solo/duo win rate
            let winRate1 = ((data[1].wins/games1) * 100).toFixed(0); //flex 5v5 win rate
            let obj = {
                rank: data[0].tier + ' ' +data[0].rank + ', ' + data[0].leaguePoints + 'LP',
                games: 'Wins: '+data[0].wins + ' Losses: ' + data[0].losses,
                winRate: `Win Ratio: ${winRate}%`
            }
            let obj1 = {
                rank: data[1].tier + ' ' +data[1].rank + ', ' + data[1].leaguePoints + 'LP',
                games: 'Wins: '+data[1].wins + ' Losses: ' + data[1].losses,
                winRate: `Win Ratio: ${winRate1}%`
            }
            let ranks = [];
            if(data[0].queueType == "RANKED_SOLO_5x5")
            {
                ranks.push(obj);
                ranks.push(obj1);
            }
            else
            {
                ranks.push(obj1);
                ranks.push(obj);
            }
            return ranks;
        }
    })
} 
function GetRegion(region, mmr) 
{
    if(mmr) //mmr regions use different url
    {
        switch(region = region.toLowerCase())
        {
            case "eun1":
            case "eune":
                return "eune";
            case "euw":
            case "euw1":
                return "euw";
            case "na":
            case "na1":
                return "na";
            default:
                return null;
        }
    }
    else
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
}
// ====== PUBLIC FUNCTIONS, AVILABLE TO USE ======
/**
 * Input: user input of name and region.
 * 
 * Output: in-game official name (how the name really looks) arr rank (0 is soloduo, 1 is flex), level, mmr(ranked mmr)
 * 
 * Exception: bad region or name input (goes to catch)
 * @param {string} name 
 * @param {string} region 
 */
async function GetSummonerStats(name, region) {
    return await new Promise((resolve, reject) => {
        region = GetRegion(region, false);
        if(region == null)
            reject("Region not found");
        GetID(name, region)
        .then(data => {
             GetRankAndTier(data[0], region)
            .then(ranks => {
                GetMMR(data[1], region)
                .then(mmr => {
                    resolve([data[1], ranks, data[3], mmr]);
                })
            })
        })
        .catch(err => {
            reject(err);
        })
    })
}
/**
 * Input: user inputted name and region
 * 
 * Output: full URL for their icon image
 * @param {string} name 
 * @param {string} region 
 */
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
    GetSummonerStats,
    GetProfileIconURL
}