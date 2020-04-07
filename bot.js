require('dotenv').config();
const db = require('./database.js');
const Discord = require('discord.js');
const bot = new Discord.Client();

console.log("[BOT] Starting... (" + getStatus(bot.status) + ")")
var counter = 0;
const PREFIX = '*' // The symbol before the commands

//================================================================================================================================================================================================


bot.on('message', async (message) => {
    var sender = message.author; // The user who sent the message.
    var msg = message.content.toUpperCase(); // Take the messsage and make it uppercase.
    var number = message.content; // Numbers that sent at counting to 10k.
    //let args = message.content.substring(prefix.lenght).split(" ")
    
    if (msg.includes('LAYLA') || msg.includes('לילה')) {
        message.channel.send('Layli lay.');
    }
    
    if (msg.includes('YAEL') || msg.includes('יעל')) {
        message.reply('לא מכבד אחי.');
    }

    if (msg.includes('FOXIE') || msg.includes('פוקסי')) {
        message.channel.send('FoX1E is my lord.');
    }

    if (msg == (PREFIX + "counter").toUpperCase()) {
        const currentCounter = await db.getCounter();
        message.channel.send("Current counter is: " + currentCounter);
    }

//counter_count chat
  
    if (message.channel.id === process.env.COUNTING_ACTIVE_CHAT_ID) // counting to 10k chat.
    {
        var numberCheck = true;
        if (isNaN(message.content)) // Checks if the message is not a number.
        {
            message.delete();
            message.author.send('> <#612392493987921930> chat only accepts **numbers**, meaning no **symbols** or **sentences**.');
            numberCheck = false;
        }

        if (numberCheck == true) {
            const currentCounter = await db.getCounter();

            // Checks if the number is incorrect or duplicate.
            if (number - 1 !== currentCounter)
            {
                message.delete();
                message.author.send('>>> You have entered an **incorrect** or **duplicate** number, \nPlease re-enter a **correct** number at <#612392493987921930>.');
            }
            else
            {
                db.incrementCounter(1);
            }
        }
    }
})

//================================================================================================================================================================================================

bot.on('ready', () => {
    console.log("[BOT] Started - ONLINE (" + getStatus(bot.status) + ")")
    console.log("[BOT] Logged in as " + bot.user.tag);
})

//welcome + add role for the new users

bot.on('guildMemberAdd', member => {
    // Add role for the new member
    let guild = member.guild;
    var role = member.guild.roles.find('name', 'DJ');
    member.addRole(role);

    // Send welcome message privately.
    member.send('>>> Hey ' + member.user.username + ', Welcome to **POCO_LOCO\'s Lounge**:exclamation: \nPlease **mark** the emoji below the first message at the ' + member.guild.channels.get('673873657843548170') + ' channel. \nBelow the first message **mark** the games that you usually play as a gamer, THX :cowboy:');
});

//================================================================================================================================================================================================

const TOKEN = process.env.DISCORD_LOGIN_TOKEN
bot.login(TOKEN);

//================================================================================================================================================================================================
/*
 * Returns status by status number.
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
    }
}

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
    if(messageReaction.emoji.name === '✔️' || messageReaction.emoji.name === '✖️')
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
    if(messageReaction.emoji.name === '✔️' && messageReaction.emoji.name === '✖️')
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




//Survival GAME
const userCreatedPolls = new Map();

bot.on('message', async message =>{
    if(message.author.bot)
    {
        return;
    }
    if(message.content.toLowerCase() === (PREFIX + 'survival').toLowerCase())
    {
        if (message.channel.id === process.env.SURVIVAL_ACTIVE_CHAT_ID)
        {
            if(userCreatedPolls.has(message.author.id))
            {
                message.channel.send("You already have a survival game going on, please stop re-tying that.")
                return;
            }
            message.channel.send("Enter the name of the participants :)");
            let filter = m => {
                if(m.author.id === message.author.id)
                {
                    if(m.content.toLowerCase() === 'done')
                    {
                        collector.stop();
                    }
                    else
                    {
                        return true;
                    }
                }
                else
                {
                    return false;
                }
            }
            let collector = message.channel.createMessageCollector(filter, {maxMatches:10} );
            let pollOptions = await getPollOptions(collector);
            if(pollOptions.length < 2)
            {
                message.channel.send("You can't play this game alone, NERD! 🤓");
                return;
            }
            let embed = new Discord.RichEmbed();
            embed.setTitle("Your list")
            embed.setDescription(pollOptions.join("\n"));
            let confirm = await message.channel.send(embed);
            await confirm.react("✔️");
            await confirm.react("✖️");
        
            let reactionFilter = (reaction, user) => (user.id === message.author.id) && !user.bot;
            let reaction = (await confirm.awaitReactions(reactionFilter, {max :1})).first();
            if(reaction.emoji.name === '✔️')
            {
                message.channel.send("The game will begin in 1 second, get ready!");
                await delay(1000);
                message.channel.send("VOTE NOW!");
                let userVotes = new Map();
                let pollTally = new Discord.Collection(pollOptions.map(o =>[o, 0]))// arry inside arry (double arry)
                let pollFilter = m => !m.bot;
                let voteCollector = message.channel.createMessageCollector(pollFilter, {
                time: 40000//the time for voting 40 sec
                });
                userCreatedPolls.set(message.author.id, voteCollector)
                await processPollResults(voteCollector, pollOptions, userVotes, pollTally);
                let max = Math.max(...pollTally.array());// the dots is for printing the arry without them []
                let entries = [...pollTally.entries()];
                let winners = [];
                let embed = new Discord.RichEmbed();
                let desc = '';//description
                entries.forEach(entry => entry[1] === max ? winners.push(entry[0]) : null);
                entries.forEach(entry => desc += entry[0]+ " has received " + entry[1] + " votes\n");
                embed.setDescription(desc);

                if(winners.length === 1)
                {
                    message.channel.send("`" + winners[0] + ", you're the one that leaving the lobby! 🌴", embed + "`");
                }
                else
                {
                    message.channel.send("`We have a draw!", embed + "`");

                }
            
            }
            else if(reaction.emoji.name === '✖️')
            {   
            message.channel.send("Survival game has been cancelled :(");
            }


        }
    }
    else if(message.content.toLowerCase() === (PREFIX + 'stopvote').toLowerCase())
    {
        if(userCreatedPolls.has(message.author.id))
        {
            userCreatedPolls.get(message.author.id).stop();
            userCreatedPolls.delete(message.author.id);

        }
        else
        {
            message.channel.send("You don't have a survival game going on :(");
        }
    }
      
});

function processPollResults(voteCollector, pollOptions, userVotes, pollTally)
{
    return new Promise((resolve, reject) =>{
        voteCollector.on('collect', msg =>{
            let option = msg.content.toLowerCase();
            if(!userVotes.has(msg.author.id) && pollOptions.includes(option))
            {
                userVotes.set(msg.author.id, msg.content);
                let voteCount = pollTally.get(option);
                pollTally.set(option, ++voteCount);
            }
        });
        voteCollector.on('end', collected => {
            console.log("Collected" + collected.size + "vote.");
            resolve(collected);
        })
    });
}




function getPollOptions(collector)
{
    return new Promise((resolve, reject) => {
        collector.on('end', collected => resolve(collected.map(m => m.content.toLowerCase())))
    });

}

function delay(time)
{
    return new Promise((resolve, reject) =>{
        setTimeout(() => {
            resolve();
        }, time)
    })
}

