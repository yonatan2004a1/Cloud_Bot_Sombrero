const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('message',(message)=> {
    let args = message.content.substring(PREFIX.length).split(" ")
    var sender = message.author;//the guy who started the game
    switch(args[0])
    {
        case 'survival':
            message.channel.send('How many player participate in the SURVIVAL?');

        break;

        case 'players':
            var SnumberCheck = true;
            if(isNaN(args[1]))
            {
                message.author.send("pls enter numbers :) ");
                SnumberCheck = false;
            }
            if(SnumberCheck==true)
            {
                for(var i=1;i<=args[1];i++)
                {
                    message.channel.send(i + " name: ");
                    if(sender == message.author){

                        bot.on('message', (Smsg) => { 
                        
                            Smsg.react("🏴‍☠️");
                        
                        })

                    }
                }
            }
        break;
    }
     
})


