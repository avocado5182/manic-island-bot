const { MessageEmbed } = require('discord.js');
// const { prefix } = require('../config.json');
require("dotenv").config();

const fs = require('fs');
const commandNames = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const spell = require('spell-checker-js');
const levenshtein = require('js-levenshtein');

spell.load('./commands/commands.txt');

module.exports = {
	name: 'help',
	description: 'Lists Manic Island\'s commands.',
	aliases: ['commands'],
	execute(message, args) {
        const data = [];
        const { commands } = message.client;
        
        if (!args.length) {
            let commandsToSend = [];
            let otherCommands = [];
            let moderationCommands = [];
            let debugCommands = [];
            let economyCommands = [];
            let funCommands = [];


            for (let _command of commands) {
                if (_command[1].name == "debug") continue;
                switch (_command[1].category) {
                    case "moderation":
                        moderationCommands.push(`\`${_command[1].name}\``);
                        break;
                    case "debug":
                        debugCommands.push(`\`${_command[1].name}\``);
                        break;
                    case "economy":
                        economyCommands.push(`\`${_command[1].name}\``);
                        break;
                    case "fun":
                        funCommands.push(`\`${_command[1].name}\``);
                        break;
                    default:
                        otherCommands.push(`\`${_command[1].name}\``);
                        break;
                }
            }

            commandsToSend.push({
                name: "Debug",
                value: debugCommands.join(" ")
            });

            commandsToSend.push({
                name: "Fun",
                value: funCommands.join(" ")
            });

            commandsToSend.push({
                name: "Economy",
                value: economyCommands.join(" ")
            });

            commandsToSend.push({
                name: "Moderation",
                value: moderationCommands.join(" ")
            });

            if (otherCommands.length > 0) {
                commandsToSend.push({
                    name: "Other",
                    value: otherCommands.join(" ")
                });
            }

            const helpEmbed = new MessageEmbed()
                .setColor('#00ff99')
                .setTitle('Manic Island Command List')
                .setThumbnail("https://cdn.discordapp.com/emojis/779828495932981279.gif?v=1")
                .setDescription('The current list of commands for Manic Island!')
                .addFields(commandsToSend)
                .setFooter('Made with ❤️ by avocado#5277');


            data.push(helpEmbed);
            
            return message.channel.send(data, { split: true });    
        }
        
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
        
        if (!command) {
            let wrong = spell.check(name);
            let realName = name;

            for (let i in commandNames) {
                if (wrong.length == 0) return;
                let cname = commandNames[i];
                let cmdName = cname.substring(0, cname.length - 3);

                for (j in wrong) {
                    let dist = levenshtein(name, cmdName);
                    if (dist < 3) {
                        realName = cmdName;
                    }
                }
            }

            return (realName == name)
                ? message.channel.send(`${process.env['PREFIX'] ?? process.env.PREFIX}${name} is not a valid command. Try again.`)
                : [
                    message.channel.send(`${process.env['PREFIX'] ?? process.env.PREFIX}${name} is not a valid command.`),
                    message.channel.send(`Did you mean \`${process.env['PREFIX'] ?? process.env.PREFIX}${realName}\`?`)
                ];

        }

        const commandProperties = [];

        let commandAliases = new Object(); 
        commandAliases.name = "**Aliases**"; 
        commandAliases.value = "None";

        let commandUsage = new Object(); 
        commandUsage.name = "**Usage**"; 
        commandUsage.value = `${process.env['PREFIX'] ?? process.env.PREFIX}${command.name}`;

        let commandCooldown = new Object(); 
        commandCooldown.name = "**Cooldown**"; 
        commandCooldown.value = "None";

        let commandDebug = new Object();
        commandDebug.name = "**Debug**";
        commandDebug.value = "No";
        
        if (command.aliases.length >= 1) commandAliases.value = `${process.env['PREFIX'] ?? process.env.PREFIX}${command.aliases.join(`, ${process.env['PREFIX'] ?? process.env.PREFIX}`)}`;
        if (command.usage) commandUsage.value = `${process.env['PREFIX'] ?? process.env.PREFIX}${command.name} ${command.usage}`;
        if (command.cooldown) commandCooldown.value = `${command.cooldown} second(s)`;
        if (command.debug) commandDebug.value = "Yes";

        commandProperties.push(
            commandAliases, 
            commandUsage, 
            commandCooldown,
            commandDebug
        );

        const commandHelpEmbed = new MessageEmbed()
            .setColor('#00ff99')
            .setTitle(`${process.env['PREFIX'] ?? process.env.PREFIX}${command.name}`)
            .setThumbnail("https://cdn.discordapp.com/emojis/779828495932981279.gif?v=1")
            .setDescription(`${command.description}`)
            .addFields(commandProperties)
            .setFooter('Made with ❤️ by avocado#5277');
            
        data.push(commandHelpEmbed);
        
        message.channel.send(data, { split: true });
	}
};