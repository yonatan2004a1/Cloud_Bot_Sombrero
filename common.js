/**
 * Common project utilities.
 * 
 * This module contains ALL things that are needed to
 * be shared between modules.
 * 
 * @module common
 */

require('dotenv').config();
const Discord = require('discord.js');
const LeagueAPI = require('./lol.js');
const db = require('./database.js');
const corona = require('./corona.js');
const PREFIX = '*' // The symbol before the commands
const bot = new Discord.Client();
const weather = require("./weather.js");
const love = require("./love.js");
module.exports = {
    bot,
    db,
    PREFIX,
    LeagueAPI,
    corona,
    weather,
    love
}