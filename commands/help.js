const { MessageEmbed } = require('discord.js');
const { prefix } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	cooldown: 5,
	execute(message, args) {
        const data = [];
        const { commands } = message.client;
        
        if (!args.length) {
            let commandsToSend = [];

            for (_command of commands) {
                let commandToPush = new Object();
                commandToPush.name = prefix + _command[1].name;
                if (commandToPush.usage != null) {
                    commandToPush += ` ${usage}`;
                }

                commandToPush.value = _command[1].description;
                commandsToSend.push(commandToPush);
            }

            const helpEmbed = new MessageEmbed()
                .setColor('#00ff99')
                .setTitle('Manic Island Command List')
                .setThumbnail("https://cdn.discordapp.com/emojis/779828495932981279.gif?v=1")
                .setDescription('The current list of commands for Manic Island!')
                .addFields(commandsToSend)
                .setFooter('Made with ❤️ by avocado#5277');


            data.push(helpEmbed);
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
            
            return message.channel.send(data, { split: true });    
        }
        
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
        
        if (!command) {
            return message.reply('that\'s not a valid command!');
        }
        
        data.push(`**Name:** ${command.name}`);
        
        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
        
        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
        
        message.channel.send(data, { split: true });
        
        
	},
};