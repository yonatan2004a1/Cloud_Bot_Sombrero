const common = require('./common.js');
const Discord = require('discord.js');
const bot = common.bot;
const db = common.db;
const PREFIX = common.PREFIX;

//Survival GAME
const userCreatedPolls = new Map();

bot.on('message', async (message) => {
    
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
            const embed = new Discord.RichEmbed();
            embed.setColor('#eb5300');
            embed.setTitle("Survival participants: ");
            embed.setDescription(pollOptions.join("\n"));
            embed.setImage('https://upload.wikimedia.org/wikipedia/he/thumb/f/fd/%D7%94%D7%99%D7%A9%D7%A8%D7%93%D7%95%D7%AA.png/220px-%D7%94%D7%99%D7%A9%D7%A8%D7%93%D7%95%D7%AA.png');
            embed.setFooter('Please vote Tiran :>');
            let confirm = await message.channel.send(embed);
            await confirm.react("✔️");
            await confirm.react("✖️");
            let reactionFilter = (reaction, user) => (user.id === message.author.id) && !user.bot;
            let reaction = (await confirm.awaitReactions(reactionFilter, {max :1})).first();
            if(reaction.emoji.name === '✔️')
            { 
                let embedVi = new Discord.RichEmbed();
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
                let desc = '';//description
                entries.forEach(entry => entry[1] === max ? winners.push(entry[0]) : null);
                entries.forEach(entry => desc += entry[0]+ " has received " + entry[1] + " votes\n");
                embedVi.setDescription(desc);

                if(winners.length === 1)
                {
                    message.channel.send(winners[0] + ", you're the one that leaving the lobby! 🌴", embedVi);
                }
                else
                {
                    message.channel.send("We have a draw!", embedVi);

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

