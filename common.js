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

const db = require('./database.js');

const PREFIX = '*' // The symbol before the commands
const bot = new Discord.Client();

module.exports = {
    bot,
    db,
    PREFIX
}