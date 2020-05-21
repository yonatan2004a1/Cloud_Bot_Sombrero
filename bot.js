const common = require('./common.js');
require('./survival.js');
const Discord = require('discord.js');
const corona = common.corona;
const leagueAPI = common.LeagueAPI;
const db = common.db;
const bot = common.bot;
const PREFIX = common.PREFIX;
const weather = common.weather;
// ==== Event registeration ================================================


bot.on('message', async (message) => {
    var sender = message.author; // The user who sent the message.
    var msg = message.content.toUpperCase(); // Take the messsage and make it uppercase.
    var number = message.content; // Numbers that sent at counting to 10k.
    var cont = message.content.slice(PREFIX.length).split(" ");
    var args = cont.slice(1); // This slices off the command in cont, only leaving the arguments.
    

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

        if (msg == (PREFIX + "counter").toUpperCase()) 
        {
            const currentCounter = await db.getCounter();
            message.channel.send("Current counter is: " + currentCounter);
        }

    if(msg.startsWith(PREFIX + 'NAENAE'))
    {
        message.channel.send("" , {files: ["https://i.imgur.com/iYpW0HP.gif"]});

    }

    // Clear messages command
    // See https://www.youtube.com/watch?v=Zpxyio10Kj0
    if (msg.startsWith(PREFIX + 'CLEAR')) 
    {
        async function clear() 
        {
            const embedClear = new Discord.RichEmbed();
            await message.delete();
            // Checks if the user has the `Poco Loco's Staff 🤠` role
            if (!message.member.roles.find("name", "Poco Loco's Staff 🤠")) 
            {
                message.channel.send('You need to be in the \`Poco Loco\'s Staff 🤠\` to use this command.');
                return;
            }
            if (message.channel.id === process.env.COUNTING_ACTIVE_CHAT_ID)
            {
                return; // I dont want someone to delete this channel.
            }
            else
            {
                if (isNaN(args[0])) // Checks if the argument is a number
                {
                    message.channel.send('Please enter a reason and amount of messages that you want to delete.\nUsage: \`' + PREFIX + 'clear <amount> <reason>\`'); //\n means new line.
                    return;
                }
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
            message.channel.bulkDelete(fetched)
                .then(() => {
                    let user = message.mentions.users.first();
                    if (!user)
                    { 
                        user = message.author;
                    }
                    var clearChannel = message.channel.name;
                    embedClear.setTitle("Clear Logs");
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
            let embedCorona = new Discord.RichEmbed();
            embedCorona.setTitle("Coronavirus status in " + data[3]);
            embedCorona.addField("Confirmed cases" , data[0] , true);
            embedCorona.addField("Recovered" , data[1] , true);
            embedCorona.addField("Deaths" , data[2] , true);
            embedCorona.setColor("#3f711e");
            embedCorona.setTimestamp();
            embedCorona.setFooter("Checkout the Coronavirus status in " + data[3] + "!" , "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/248/microbe_1f9a0.png");
            message.channel.send(embedCorona);

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
                embed.setTitle(location.toUpperCase());
                embed.addField("Precipitation: " , data[6]);
                embed.addField("Temperature" , `${data[0]}°C`);
                embed.addField("Humidity" , data[1] + "%"); 
                embed.addField("Temperature Feels like" ,data[2] + "°");
                // embed.addField("Minimum temperature" , data[3] + "°");
                // embed.addField("Maximum temperature" , data[4] + "°");
                embed.addField("Wind speed" , data[5] + " km/h");
                embed.setColor("#ffae30");
                embed.setTimestamp();
                embed.setFooter("Check out " + location + "'s weather!", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/248/sun-behind-rain-cloud_1f326.png");
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
        let embedCommandList = new Discord.RichEmbed();
        embedCommandList.setTitle("Sombrero Guy's Command List");
        embedCommandList.addField("🌦️ Weather" , "`*weather <city>`\n**Shows the current weather in a city**");
        embedCommandList.addField("🧹 Clear" , "`*clear <amount> <reason>`\n**Usable by the Poco Loco's staff**");
        embedCommandList.addField("🦠 Corona" , "`*corona <country>`\n**Shows the current Coronavirus status in a country**" )
        embedCommandList.addField("🌴 Survival" , "`*survival`\n**Usable in <#" + process.env.SURVIVAL_ACTIVE_CHAT_ID + "> text channel**");
        embedCommandList.addField("🔢 Counting" , "`*counter`\n**Shows the current number in <#" + process.env.COUNTING_ACTIVE_CHAT_ID + "> text channel**");
        embedCommandList.addField("📊 Stats" , "`*stats <name> <region>`\n**Usable in <#" + process.env.BOT_COMMANDS_ACTIVE_CHAT_ID + "> & <#" + process.env.LEAGUE_ACTIVE_CHAT_ID + "> text channels**");
        embedCommandList.setColor("#7289da");
        message.channel.send(embedCommandList);
    }

    //counter_count chat
    if (message.channel.id === process.env.COUNTING_ACTIVE_CHAT_ID) // counting to 10k chat.
    {
        var numberCheck = true;
        if (isNaN(message.content)) // Checks if the message is not a number.
        {
            message.delete();
            message.author.send("> <#" + process.env.COUNTING_ACTIVE_CHAT_ID + "> text channel only accepts **numbers**, meaning no **symbols** or **sentences**");
            numberCheck = false;
        }

        if (numberCheck == true) {
            const currentCounter = await db.getCounter();

            // Checks if the number is incorrect or duplicate.
            if (number - 1 !== currentCounter)
            {
                message.delete();
                message.author.send(">>> You have entered an **incorrect** or **duplicate** number, \nPlease re-enter a **correct** number at <#" + process.env.COUNTING_ACTIVE_CHAT_ID + "> text channel");
            }
            else
            {
                db.incrementCounter(1);
            }
        }
    }
});

//================================================================================================================================================================================================

bot.on('ready', () => {
    console.log("[BOT] Started - ONLINE (" + getStatus(bot.status) + ")");
    console.log("[BOT] Logged in as " + bot.user.tag);
    
    // Bot activity
    bot.user.setActivity('Un Poco Loco', { type: "LISTENING"}).catch(console.error);
})

// Welcome message & Role to the new users
bot.on('guildMemberAdd', member => {
    // Add role for the new member
    let guild = member.guild;
    var role = member.guild.roles.find('name', 'DJ');
    member.addRole(role);

    // Send welcome message privately.
    member.send('>>> Hey ' + member.user.username + ', Welcome to **POCO_LOCO\'s Lounge**:exclamation: \nPlease **mark** the emoji below the first message at the ' + member.guild.channels.get('673873657843548170') + ' channel. \nBelow the first message **mark** the games that you usually play as a gamer, THX :cowboy:');
});

//================================================================================================================================================================================================
/*
 * Adds/Removes roles by reaction/unreacting to a message.
 * See https://www.youtube.com/watch?v=98Wi_MJ1wOI
 */
bot.on('raw', event => {
    const eventName = event.t;
    if (eventName === 'MESSAGE_REACTION_ADD') //Checks the correct event.
    {
        if (event.d.message_id === '673910833411260426' || event.d.message_id === '674304357218385939') //Checks the correct channel.
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
        if (event.d.message_id === '673910833411260426' || event.d.message_id === '674304357218385939') // Checks the correct message.
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
 * See https://discord.js.org/#/docs/main/v11/typedef/Status
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
