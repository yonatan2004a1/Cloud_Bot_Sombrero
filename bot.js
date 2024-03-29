const common = require('./common.js');
require('./survival.js');
const Discord = require('discord.js');
const corona = common.corona;
const leagueAPI = common.LeagueAPI;
const db = common.db;
const bot = common.bot;
const PREFIX = common.PREFIX;
const weather = common.weather;
const love = common.love;
const nasa = common.nasa;
const fivem = common.fivem;
// ==== Event registeration ================================================
bot.on('message', async (message) => {
    var sender = message.author; // The user who sent the message.
    var msg = message.content.toUpperCase(); // Take the messsage and make it uppercase.
    var number = message.content; // Numbers that sent at counting to 10k.
    var cont = message.content.slice(PREFIX.length).split(" ");
    var args = cont.slice(1); // This slices off the command in cont, only leaving the arguments.
    
    /*
    if (msg.includes('LAYLA') || msg.includes('לילה'))
    {
            message.channel.send('Layli lay.');
    }

    if (msg.includes('YAEL') || msg.includes('יעל'))
    {
        message.reply('לא מכבד אחי.');
    }

    if (msg.includes('FOXIE') || msg.includes('פוקסי'))
    {
        message.channel.send('FoX1E is my lord.');
    }
    */

    // Verify bot message command

    const verifyEmbed = new Discord.RichEmbed();
    if (msg.startsWith(PREFIX + 'VERIFY'))
    {
        if (!message.member.roles.has(process.env.BOT_PROGRAMMER_ROLE_ID))
        {
            message.channel.send('You must be bot programmer to send a verify message :)');
            return;
        }
        else
        {
            //message design
            verifyEmbed.setTitle(`Welcome to ${message.guild.name}!`);
            verifyEmbed.setDescription("Please **react** to this message to receive a pickle role.");
            verifyEmbed.setColor("fcb040");
            verifyEmbed.setImage('https://cdn.discordapp.com/attachments/420122298805125120/751770348025806864/Falafel_Baribua_Embed.png');

            bot.channels.get(process.env.VERIFY_ACTIVE_CHAT_ID).send(verifyEmbed).then(m => m.react(`${process.env.PICKLE_EMOJI_ID}`));//send the message to  verify channel and add a reaction.
        }
    }
    

    // Game selection message command
    const gameSelectionEmbed = new Discord.RichEmbed();
    if (msg.startsWith(PREFIX + 'GAMESELECTION'))
    {
        if (!message.member.roles.has(process.env.BOT_PROGRAMMER_ROLE_ID))
        {
            message.channel.send('You must be bot programmer to send a verify message :)');
            return;
        }
        else
        {
            gameSelectionEmbed.setTitle("You've reached the game selection channel!");
            gameSelectionEmbed.setDescription("Here you can associate yourself with the gaming communities you play in!\nPlease click on the emojis below the message that corresponding for the games you play.");
            gameSelectionEmbed.addField("Games selection:" , `<:League_of_Legends:${process.env.LEAGUE_OF_LEGENDS_EMOJI_ID}> **:** League of Legends\n<:VALORANT:${process.env.VALORANT_EMOJI_ID}> **:** VALORANT\n<:Among_Us:${process.env.AMONG_US_EMOJI_ID}> **:** Among Us\n<:Minecraft:${process.env.MINECRAFT_EMOJI_ID}> **:** Minecraft`);
            gameSelectionEmbed.setColor("fcb040");
            gameSelectionEmbed.setImage('https://cdn.discordapp.com/attachments/420122298805125120/751770348025806864/Falafel_Baribua_Embed.png');

            bot.channels.get(process.env.GAME_SELECTION_ACTIVE_CHAT_ID).send(gameSelectionEmbed).then(m => {
                m.react(`${process.env.LEAGUE_OF_LEGENDS_EMOJI_ID}`)
                m.react(`${process.env.VALORANT_EMOJI_ID}`)
                m.react(`${process.env.AMONG_US_EMOJI_ID}`)
                m.react(`${process.env.MINECRAFT_EMOJI_ID}`)
            });

        }
    }

    if (msg.startsWith(PREFIX + 'COUNTER'))
    {
        const currentCounter = await db.getCounter();//last message
        var id = currentCounter.lastCounterUserID;//the user who send the last message

        if (id != null)
        {
            var user = bot.users.get(id);
            message.channel.send(`Current counter: ${currentCounter.counter}\nLast counter: ${user.tag}`);
        }
        else
        {
            message.channel.send(`Current counter: ${currentCounter.counter}`);
        }
    }

    if (msg.startsWith(PREFIX + 'NAENAE'))
    {
        message.channel.send("" , {files: ["https://i.imgur.com/iYpW0HP.gif"]});

    }

    // Clear messages command
    if (msg.startsWith(PREFIX + 'CLEAR')) 
    {
        async function clear() 
        {
            let cont = message.content.slice(PREFIX.length).split(" ");
            let args = cont.slice(1); // This slices off the command in cont, only leaving the arguments.
            const embedClear = new Discord.RichEmbed();
            await message.delete();
            if (!message.member.roles.has(process.env.STAFF_ROLE_ID)) // Checks if user has the staff role
            {
                message.channel.send('You must be staff to clear messages.');
                return;
            }
            
            if (message.channel.id === process.env.COUNTING_ACTIVE_CHAT_ID)//checks if is the counting chat
            {
                return; // I dont want someone to delete this channel.
            }
            
            if (isNaN(args[0])) // Checks if the argument is a number
            {
                message.channel.send('Please enter the amount of messages that you want to delete.\nUsage: \`' + PREFIX + 'clear <amount> <reason>\`'); //\n means new line.
                console.log(args[0]);
                return;
            }

            const fetched = await message.channel.fetchMessages({limit: args[0]}); // This grabs the last number(args) of messages in the channel.
            var reason = "";
            for (let i = 1; i < args.length; i++)
            {
                reason += args[i] + " ";
            }
            
            if (!reason)
            {
                message.channel.send('Please enter a reason to clear the messages.\nUsage: \`' + PREFIX + 'clear ' + fetched.size + ' <reason>\`')
                return;
            }

            // Deleting the messages
            message.channel.bulkDelete(fetched)//send message to clear logs
                .then(() => {
                    let user = message.mentions.users.first();
                    if (!user)
                    { 
                        user = message.author;
                    }
                    var clearChannel = message.channel.name;
                    embedClear.setTitle("Clear Log");
                    embedClear.addField("Messages cleaner" , message.author);
                    embedClear.addField("Cleared" , fetched.size) ;
                    embedClear.addField("From" , clearChannel);
                    embedClear.addField("Reason" , reason);
                    embedClear.setColor("#fffefe");
                    embedClear.setTimestamp();
                    embedClear.setFooter("NotUniqueBroom" , 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Broom_icon.svg/1200px-Broom_icon.svg.png');
                    embedClear.setThumbnail(user.avatarURL);
                    bot.channels.get(process.env.CLEARLOG_ACTIVE_CHAT_ID).send(embedClear);
                })
                .catch(error => message.channel.send(`Error: ${error}`)); // If it finds an error, it posts it into the channel.
        }
        clear();   
    }

    // Shutdown command
    if (message.channel.type != 'text' || message.author.bot)
    {
        return;
    }
    
    if (msg.startsWith(PREFIX + 'SHUTDOWN')){
        if (!message.member.roles.has(process.env.BOT_PROGRAMMER_ROLE_ID))
        {
            message.channel.send('You must be bot programmer to shutdown me :)');
            return;
        }
        else
        {
            message.channel.send('Shutting down...').then(m => {
            bot.destroy();
        })
    }   
};

    // Corona API
    if(msg.startsWith(PREFIX + 'CORONA'))
    {
        if(!args[0])
        {
            message.channel.send("The corona command allows you to search statistics of a country on the Coronavirus.\nUsage: \`" + PREFIX + 'corona <country>\`');
        }
        else
        {
        var country = "";
        for(let i = 0; i < args.length - 1; i++)
        {
            country += (args[i]+" ");
        }
        country += args[args.length - 1];
        corona.GetCoronaStats(country)
        .then(data => {
            let coronaEmbed = new Discord.RichEmbed();
            coronaEmbed.setTitle("Coronavirus status in " + data[3]);
            coronaEmbed.addField("Confirmed cases" , data[0] , true);
            coronaEmbed.addField("Recovered" , data[1] , true);
            coronaEmbed.addField("Deaths" , data[2] , true);
            coronaEmbed.setColor("#3f711e");
            coronaEmbed.setTimestamp();
            coronaEmbed.setFooter("Checkout the Coronavirus status in " + data[3] + "!" , "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/248/microbe_1f9a0.png");
            message.channel.send(coronaEmbed);

        })
        .catch(err => {
            message.channel.send(err);
        })
        }
    }
    // League API
    if (msg.startsWith(PREFIX + 'STATS'))
    {
        if (message.channel.id != process.env.LEAGUE_ACTIVE_CHAT_ID && message.channel.id != process.env.BOT_COMMANDS_ACTIVE_CHAT_ID)
        {
            return;
        }
        if (!args[0] || !args[1])
        {
            message.channel.send("The stats command allows you to search statistics of a League of Legends account.\nUsage: \`" + PREFIX + 'stats <name> <region>\`');
        }
        else
        {
            let name = ""
            let embed = new Discord.RichEmbed();
            for (var i = 0; i < args.length-1; i++)
            {
                name += args[i];
            }
            
            let region = args[args.length-1];
            leagueAPI.GetSummonerStats(name, region)
            .then(data => {
                let ranks = data[1];
                let user = message.mentions.users.first();
                if (!user)
                { 
                    user = message.author;
                }

                embed.setTitle(data[0] + "'s stats");
                embed.addField("Level" , data[2], true);
                embed.addField("MMR", data[3], true); 
                embed.addField("Solo/Duo" , ranks[0].rank +'\n'+ranks[0].games +'\n'+ranks[0].winRate , false);
                embed.addField("Flex 5v5" , ranks[1].rank +'\n'+ranks[1].games +'\n'+ranks[1].winRate , false);
                embed.setColor("#cf95f8");
                embed.setTimestamp();
                embed.setFooter("Check out " + data[0] + "'s stats!" , user.avatarURL);
                leagueAPI.GetProfileIconURL(data[0], region)
               .then(url => {
                embed.setThumbnail(url); //- will be the profile icon of the summoner
                message.channel.send(embed);
            })
            })
            .catch(err => {
                message.channel.send("Error: "+err);
            })
        }
    }
    // Nasa API
    if(msg.startsWith(PREFIX + 'NASA'))
    {
        if(!args[0])
        {
            message.channel.send("Choose a valid NASA command");
        }
        else if(args[0].toLowerCase() == 'pic'||'picture')
        {
            nasa.GetDailyPic(args[1])
            .then(data => {
                let embed = new Discord.RichEmbed();
                embed.setTitle(data[0]);
                embed.setDescription(data[1]);
                embed.setImage(data[2]);
                embed.setFooter("Daily image date: "+data[3] , "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/248/rocket_1f680.png");
                embed.setColor("#55acee");
                message.channel.send(embed);
            })
            .catch(err => {
                message.channel.send("Error: "+err);
            })
        }
    }
    // Love API
    if(msg.startsWith(PREFIX + 'LOVE'))
    {
        if(args.length == 2)
        {
            love.GetLove(args[0], args[1])
            .then(data => {
                let embed = new Discord.RichEmbed();
                embed.setTitle(args[0] + " & " + args[1]);
                embed.addField("Percentage", data[0]);
                embed.addField("Status", data[1]);
                embed.setColor("#fc2db4");
                message.channel.send(embed);
            })
            .catch(err => {
                message.channel.send(err);
            })
        }
        else
        {
            // I dont know what to write here just say its wrong and write first and family name
            message.channel.send("enter your name and a 2nd name dum dum");
        }

    }
    // FiveM API
    if(msg.startsWith(PREFIX + 'FIVEM'))
    {
        if(!args[0])
        {
            message.channel.send("what? cunt send me the server's IP");
        }
        else//asd
        {
            serverIP = args[0]
            fivem.GetServer(serverIP)
            .then(data => {
                message.channel.send(`This server has ${data} players.`)
            })
            .catch(err => {
                message.channel.send("Error: "+err);
            })
        }
    }
    // Weather API
    if(msg.startsWith(PREFIX + 'WEATHER'))
    {
        if(!args[0])
        {
            message.channel.send("The weather command allows you to search statistics of weather in a specific city.\nUsage: \`" + PREFIX + 'weather <city>\`');
        }
        else
        {
            let embed = new Discord.RichEmbed();
            let location = ""
            for (var i = 0; i < args.length-1; i++)
            {
                location += args[i] + " ";
            }
            location +=args[args.length - 1];
            weather.GetWeather(location)
            .then(data => {
                embed.setTitle(location[0].toUpperCase() + location.substring(1));
                embed.addField("Precipitation" , data[6]);
                embed.addField("Temperature" , `${data[0]}°C`);
                embed.addField("Humidity" , data[1] + "%"); 
                embed.addField("Temperature Feels like" ,data[2] + "°");
                // embed.addField("Minimum temperature" , data[3] + "°");
                // embed.addField("Maximum temperature" , data[4] + "°");
                embed.addField("Wind speed" , data[5] + " km/h");
                if (data[0] >= 40)
                {
                    embed.setColor("#eb586e");
                    embed.setFooter("Check out the current weather!", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/248/hot-face_1f975.png");
                }
                        
                else if (data[0] > 30 && data[0] < 40)
                {
                    embed.setColor("#ffcc4d");
                    embed.setFooter("Check out the current weather!", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/248/sun-with-face_1f31e.png");
                }
                else if (data[0] < 30 && data[0] > 10)
                {
                    embed.setColor("#5dadec");
                    embed.setFooter("Check out the current weather!", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/248/droplet_1f4a7.png");
                }
                else
                {
                    embed.setColor("#bcdef5");
                    embed.setFooter("Check out the current weather!", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/248/cold-face_1f976.png");
                }
                embed.setTimestamp();
                message.channel.send(embed);
            })
            .catch(err => {
                message.channel.send("Error: "+err);
            })
        }
    }
    
    // Command list command
    if (msg.startsWith(PREFIX + 'COMMANDS'))
    {
        let commandListEmbed = new Discord.RichEmbed();
        commandListEmbed.setTitle(`${bot.user.username}'s Command List`);
        commandListEmbed.addField("🌦️ Weather" , "`*weather <city>`\n**Shows the current weather in a city**");
        commandListEmbed.addField("🧹 Clear" , "`*clear <amount> <reason>`\n**Usable only by the staff**");
        commandListEmbed.addField("🦠 Corona" , "`*corona <country>`\n**Shows the current Coronavirus status in a country**" );
        //commandListEmbed.addField("🌴 Survival" , "`*survival`\n**Usable in <#" + process.env.SURVIVAL_ACTIVE_CHAT_ID + "> text channel**");
        commandListEmbed.addField("🔢 Counting" , "`*counter`\n**Shows the current number in <#" + process.env.COUNTING_ACTIVE_CHAT_ID + "> text channel**");
        commandListEmbed.addField("📊 Stats" , "`*stats <name> <region>`\n**Usable in <#" + process.env.BOT_COMMANDS_ACTIVE_CHAT_ID + "> & <#" + process.env.LEAGUE_ACTIVE_CHAT_ID + "> text channels**");
        commandListEmbed.addField("🚀 Nasa", "`*nasa pic(ture) <date(yyyy-mm-dd)>`\n**Shows a daily astronomy picture (not putting a date will give the latest picture)**");
        commandListEmbed.addField("❤️ Love", "`*love <1st name> <2nd name>` \n**Shows a love percentage and gives a status**");
        commandListEmbed.setColor("#7289da");
        message.channel.send(commandListEmbed);
    }

    
    //counter_count chat
    if (message.channel.id === process.env.COUNTING_ACTIVE_CHAT_ID) // counting to 10k chat.
    {
        var numberCheck = true;
        if (isNaN(message.content)) // Checks if the message is not a number.
        {
            message.delete();
            message.author.send(`> <#${process.env.COUNTING_ACTIVE_CHAT_ID}> text channel only accepts **numbers**, meaning no **symbols** or **sentences**.`);
            numberCheck = false;
        }

        if (numberCheck == true) {
            const currentCounter = await db.getCounter();

            // Checks if the number is incorrect or duplicate.
            if (number - 1 !== currentCounter.counter)
            {
                message.delete();
                message.author.send(`>>> You have entered an **incorrect** or **duplicate** number, \nThe next correct number is **${currentCounter.counter + 1}**.\nPlease re-enter the **correct** number at <#${process.env.COUNTING_ACTIVE_CHAT_ID}> text channel.`);
            }
            else
            {
                db.incrementCounter(1, message.author.id);
            }
        }
    }

     // Server Information Command
     if(msg.startsWith(PREFIX + 'SERVERINFO'))
     {
        let guild = bot.guilds.get(process.env.SERVER_ID);
        let serverName = message.guild.name;
        let serverIcon = message.guild.iconURL;

        //let owner = message.guild.member(guild.owner) ? guild.owner.toString() : guild.owner.user.tag;

        let region = message.guild.region;
 
        let members = guild.members.filter(member => !member.user.bot).size; 
        let onlineMembers = guild.members.filter(m => m.presence.status === 'online').size;
        let bots = guild.members.filter(member => member.user.bot).size;
 
        let emojiSize = guild.emojis.size;
        let normalEmojis = guild.emojis.filter(emoji => !emoji.animated).size;
        let animatedEmojis = guild.emojis.filter(emoji => emoji.animated).size;

        let roleSize = guild.roles.size;

        function checkDays(date) {
            let now = new Date();
            let diff = now.getTime() - date.getTime();
            let days = Math.floor(diff / 86400000);
            return days + (days == 1 ? " day" : " days") + " ago";
        };
 
        let serverInfoEmbed = new Discord.RichEmbed();
        serverInfoEmbed.setTitle('**' + `${message.guild.name} Server Information ℹ️` + '**');
        serverInfoEmbed.setThumbnail(serverIcon);
        serverInfoEmbed.addField(`👑 Owner`, '```' + guild.owner.user.tag + '```', true);
        serverInfoEmbed.addField(`🏴 Region`, '```' + region[0].toUpperCase() + region.substring(1) + '```', true);
        serverInfoEmbed.addField(`👥 Members (${members})`, '```' + `Bots: ${bots} | Online: ${onlineMembers}` + '```');
        serverInfoEmbed.addField(`😃 Emojis (${emojiSize})`, '```' + `Normal: ${normalEmojis} | Animated: ${animatedEmojis}` + '```', true);
        serverInfoEmbed.addField(`🔱 Roles (${roleSize})`, '```' + message.guild.roles.map(role => role.name).join(`, `) + '```');
        serverInfoEmbed.addField(`📅 Creation Date`, '```' + `${message.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})` + '```');
        serverInfoEmbed.setColor("RANDOM");
        message.channel.send(serverInfoEmbed);
     }
});

//================================================================================================================================================================================================

bot.on('ready', () => {
    console.log(`[BOT] Started - ONLINE (${getStatus(bot.status)})`);
    console.log(`[BOT] Logged in as ${bot.user.tag}`);
    
    // Update member count on start-up
    const guild = bot.guilds.get(`${process.env.SERVER_ID}`);
    updateMembers(guild);

    // Bot voice channel join
    const channel = bot.channels.get(`${process.env.SOMBRERO_GUY_CHANNEL_ID}`);
    if (!channel)
    {
        return console.error("Channel not exist");
    }
    channel.join().then(connection => {
    console.log(`[BOT] Connected to ${channel.name}`);
    }).catch(e => {
    console.error(e);
  });
})

bot.on('guildMemberAdd', (member) => {
    // Add DJ role for the new member
    member.addRole(member.guild.roles.find(role => role.name === "DJ"));

    // Send welcome message privately.
    member.send(`>>> Hey ${member.user.username}, Welcome to **Falafel²**:exclamation:\nPlease **react** the pickle emoji on <#${process.env.VERIFY_ACTIVE_CHAT_ID}> channel to receive your role.`);

    // Update bot activity and member count when user joins the server
    updateMembers(member.guild);
});

bot.on('guildMemberRemove', (member) => {
    // Update bot activity and member count when user leaves the server
    updateMembers(member.guild);
});

function updateMembers(guild) {
    const membersCount = guild.members.filter((member) => !member.user.bot).size;
    bot.user.setActivity(`${membersCount} Members`, { type: "WATCHING"}).catch(console.error);
}

//================================================================================================================================================================================================
/*
 * Adds/Removes roles by reaction/unreacting to a message.
 */
bot.on('raw', event => {
    const eventName = event.t;
    if (eventName === 'MESSAGE_REACTION_ADD') //Checks the correct event.
    {
        if (event.d.message_id === process.env.VERIFY_ACTIVE_MESSAGE_ID || event.d.message_id === process.env.GAME_SELECTION_ACTIVE_MESSAGE_ID) //Checks the correct channel.
        {
            var reactionChannel = bot.channels.get(event.d.channel_id)
            if (reactionChannel.messages.has(event.d.message_id)) // Checks if he has message.
            {
                return;
            }
            else
            {
                reactionChannel.fetchMessage(event.d.message_id)
                .then(msg => {
                    var msgReaction = msg.reactions.get(event.d.emoji.name + ":" + event.d.emoji.id); // Checks the correct reaction.
                    var user = bot.users.get(event.d.user_id); // Checks the user who added the reaction.
                    bot.emit('messageReactionAdd', msgReaction, user);
                })
                .catch(err => console.log(err))
            }
        }
    }
    else if (eventName === 'MESSAGE_REACTION_REMOVE') // Checks the correct event.
    {
        if (event.d.message_id === process.env.VERIFY_ACTIVE_MESSAGE_ID || event.d.message_id === '674304357218385939') // Checks the correct message.
        {
            var reactionChannel = bot.channels.get(event.d.channel_id) // Checks the correct channel.
            if (reactionChannel.messages.has(event.d.message_id)) // Checks if he has message.
            {
                return;
            }
            else
            {
                reactionChannel.fetchMessage(event.d.message_id)
                .then(msg => {
                    var msgReaction = msg.reactions.get(event.d.emoji.name + ":" + event.d.emoji.id); // Checks the correct reaction.
                    var user = bot.users.get(event.d.user_id); // Checks the user who removed the reaction.
                    bot.emit('messageReactionRemove', msgReaction, user);
                })
                .catch(err => console.log(err))
            }
        }
    }
});

bot.on('messageReactionAdd', (messageReaction, user) => {
    if (messageReaction.emoji.name === '✔️' || messageReaction.emoji.name === '✖️')
    {
        return
    }
    
    var roleName = messageReaction.emoji.name;
    var role = messageReaction.message.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());

    if (role)
    {
        var member = messageReaction.message.guild.members.find(member => member.id === user.id);
        if (member)
        {
            member.addRole(role.id);
        }
    }
   
});

bot.on('messageReactionRemove', (messageReaction, user) => {
    if (messageReaction.emoji.name === '✔️' && messageReaction.emoji.name === '✖️')
    {
        return
    }

    var roleName = messageReaction.emoji.name;
    var role = messageReaction.message.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());

    if (role)
    {
        var member = messageReaction.message.guild.members.find(member => member.id === user.id);
        if (member)
        {
            member.removeRole(role.id);
        }
    }

});

//================================================================================================================================================================================================

console.log("[BOT] Starting... (" + getStatus(bot.status) + ")");

const TOKEN = process.env.DISCORD_LOGIN_TOKEN
bot.login(TOKEN);

//================================================================================================================================================================================================

/*
 * Returns Discord bot client status by status number.
 */
function getStatus(statusNumber) {
    switch (statusNumber) {
        case 0:
            return "READY";
        case 1:
            return "CONNECTING";
        case 2:
            return "RECONNECTING";
        case 3:
            return "IDLE";
        case 4:
            return "NEARLY";
        case 5:
            return "DISCONNECTED";
        default:
            return "UNKNOWN (status number " + statusNumber + ")";
    }
}
