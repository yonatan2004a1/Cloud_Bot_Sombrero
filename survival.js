const Discord = require('discord.js');
const bot = new Discord.Client();

//Survival GAME
const userCreatedPolls = new Map();

bot.on('message', async message =>{
    if(message.author.bot)
    {
        return;
    }
    if(message.content.toLowerCase() === '!survival')
    {
        if (message.channel.id === '696409036790431785')
        {
            if(userCreatedPolls.has(message.author.id))
            {
                message.channel.send("You already have a survival game going on. pls stop doing that")
                return;
            }
            message.channel.send("yo btch pls enter the players pls :)");
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
                message.channel.send("dont play this game alone you cunt!");
                return;
            }
            let embed = new Discord.MessageEmbed();
            embed.setTitle("Your list")
            embed.setDescription(pollOptions.join("\n"));
            let confirm = await message.channel.send(embed);
            await confirm.react("✔️");
            await confirm.react("✖️");
        
            let reactionFilter = (reaction, user) => (user.id === message.author.id) && !user.bot;
            let reaction = (await confirm.awaitReactions(reactionFilter, {max :1})).first();
            if(reaction.emoji.name === '✔️')
            {
                message.channel.send("THE game will begin in 5 seconds so be ready");
                await delay(5000);
                message.channel.send("VOTE NOW!");
                let userVotes = new Map();
                let pollTally = new Discord.Collection(pollOptions.map(o =>[o, 0]))// arry inside arry (double arry)
                let pollFilter = m => !m.bot;
                let voteCollector = message.channel.createMessageCollector(pollFilter, {
                time: 60000//the time for voting
                });
                userCreatedPolls.set(message.author.id, voteCollector)
                await processPollResults(voteCollector, pollOptions, userVotes, pollTally);
                let max = Math.max(...pollTally.array());// the dots is for printing the arry without them []
                let entries = [...pollTally.entries()];
                let winners = [];
                let embed = new Discord.MessageEmbed();
                let desc = '';//description
                entries.forEach(entry => entry[1] === max ? winners.push(entry[0]) : null);
                entries.forEach(entry => desc += entry[0]+ " received " + entry[1] + " votes\n");
                embed.setDescription(desc);

                if(winners.length === 1)
                {
                    message.channel.send(winners[0] + " is the ONE that will play alone ", embed);
                }
                else
                {
                    message.channel.send("We have a draw", embed);

                }
        }
        else if(reaction.emoji.name === '❌')
        {   
            message.channel.send("SURVIVAL cancelled");
        }

        }
        else if(message.content.toLowerCase() === '!stopvote')
        {
            if(userCreatedPolls.has(message.author.id))
            {
                console.log("Trying to stop poll.");
                userCreatedPolls.get(message.author.id).stop();
                userCreatedPolls.delete(message.author.id);

            }
            else
            {
                message.channel.send("You dont have a 'survival' goin on :(");
            }
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