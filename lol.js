//var RiotRequest = require('riot-lol-api');
const fetch = require("node-fetch");
const common = require('./common.js');
const Discord = require('discord.js');
const bot = common.bot;
const db = common.db;
const PREFIX = common.PREFIX;
//const riotKey = new RiotRequest('RGAPI-760c5463-f8ba-471f-ad17-2a948758088a')
const key = "RGAPI-760c5463-f8ba-471f-ad17-2a948758088a";
const region = "EUN1";
const url = "https://" + region + ".api.riotgames.com" + "/lol/summoner/v4/summoners/by-name/loger2" + "?api_key=" + key;
const response = fetch(url)
.then(response => response.json())
.then(data => console.log(data));




/*const data = response.json();
console.log(data.id)
console.log(url)*/
