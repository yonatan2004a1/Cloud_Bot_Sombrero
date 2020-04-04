const Discord = require('discord.js');
const bot = new Discord.Client();

console.log("[BOT] Starting... (" + getStatus(bot.status) + ")")
var counter = 0;
const prefix = '*' // The symbol before the commands

//================================================================================================================================================================================================


bot.on('message', (message) => {
    var sender = message.author; // The user who sent the message.
    var msg = message.content.toUpperCase(); // Take the messsage and make it uppercase.
    var number = message.content; // Numbers that sent at counting to 10k.
    let args = message.content.substring(prefix.lenght).split(" ")

    
    if (msg.includes('LAYLA') || msg.includes('לילה')) {
        message.channel.send('Layli lay.');
    }
    
    if (msg.includes('YAEL') || msg.includes('יעל')) {
        message.reply('לא מכבד אחי.');
    }

    if (msg.includes('FOXIE') || msg.includes('פוקסי')) {
        message.channel.send('FoX1E is my lord.');
    }


  
    if (message.channel.id === '612392493987921930') // counting to 10k chat.
    {
        var numberCheck = true;
        if (isNaN(message.content)) // Checks if the message is not a number.
        {
            message.delete();
            message.author.send('> ' + ' chat only accepts numbers, meaning no symbols or sentences.');
            numberCheck = false;
        }

        if (numberCheck == true) {
            if (number - 1 != 4437 + counter) // Checks if the number is incorrect or duplicate.
            {
                message.delete();
                message.author.send('>>> You have entered an incorrect number, \nPlease re-enter a correct number thx :)' );
            }
            else {
                counter++;
            }

        }

    }
})


bot.on('ready', () => {
    console.log("[BOT] Started - ONLINE (" + getStatus(bot.status) + ")")
    console.log("[BOT] Logged in as " + bot.user.tag);
})

//================================================================================================================================================================================================

bot.on('guildMemberAdd', member => {
    // Add role for the new member
    let guild = member.guild;
    var role = member.guild.roles.find('name', 'DJ');
    member.addRole(role);

    // Send welcome message privately.
    member.send('>>> Hey ' + member.user.username + ', Welcome to **POCO_LOCO\'s Lounge**:exclamation: \nPlease **mark** the emoji below the first message at the ' + member.guild.channels.get('673873657843548170') + ' channel. \nBelow the first message **mark** the games that you usually play as a gamer, THX :cowboy:');
});

//================================================================================================================================================================================================
bot.login('Njk0Mjk3NzA4MDM0MzkyMDk1.XoOR4w.RtbhFkDaKzmta4MNmBWBLndhGuE');
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

 //See https://www.youtube.com/watch?v=98Wi_MJ1wOI

bot.on('raw', event => {
    const eventName = event.t;
    if (eventName === 'MESSAGE_REACTION_ADD')//Checks the correct event.
    {
        if (event.d.message_id === '673910833411260426' || event.d.message_id === '674304357218385939')//Checks the correct channel.
        {
            var reactionChannel = bot.channels.get(event.d.channel_id)
            if (reactionChannel.messages.has(event.d.message_id))// Checks if he has message 
            {
                return;
            }
            else
            {
                reactionChannel.fetchMessage(event.d.message_id)
                .then(msg => {
                    var msgReaction = msg.reactions.get(event.d.emoji.name + ":" + event.d.emoji.id);// Checks the correct reaction
                    var user = bot.users.get(event.d.user_id);// Checks the user who added the reaction
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
                    var msgReaction = msg.reactions.get(event.d.emoji.name + ":" + event.d.emoji.id);// Checks the correct reaction
                    var user = bot.users.get(event.d.user_id);// Checks the user who removed the reaction
                    bot.emit('messageReactionRemove', msgReaction, user);
                })
                .catch(err => console.log(err))
            }
        }
    }
});

bot.on('messageReactionAdd', (messageReaction, user) => {
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



