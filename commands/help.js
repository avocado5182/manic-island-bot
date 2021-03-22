const { MessageEmbed } = require('discord.js');
const { prefix } = require('../config.json');

const fs = require('fs');
const commandNames = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const spell = require('spell-checker-js');
const levenshtein = require('js-levenshtein');

spell.load('./commands/commands.txt');

const Keyv = require('keyv');

const serverSettings = new Keyv({ serialize: JSON.stringify, deserialize: JSON.parse });
serverSettings.on('error', e => console.error(`Keyv connection error: ${e}`));

module.exports = {
	name: 'help',
	description: 'Lists Manic Island\'s commands.',
	aliases: ['commands'],
	execute(message, args) {
        const data = [];
        const { commands } = message.client;
        
        if (!args.length) {
            let commandsToSend = [];

            for (_command of commands) {
                if (_command[1].name == "debug") continue;
                let commandToPush = new Object();
                commandToPush.name = prefix + _command[1].name;
                if (commandToPush.usage != null) commandToPush += ` ${usage}`;

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
                ? message.channel.send(`${prefix}${name} is not a valid command. Try again.`)
                : [
                    message.channel.send(`${prefix}${name} is not a valid command.`),
                    message.channel.send(`Did you mean \`${prefix}${realName}\`?`)
                ];

        }

        const commandProperties = [];

        let commandAliases = new Object(); 
        commandAliases.name = "**Aliases**"; 
        commandAliases.value = "None";

        let commandUsage = new Object(); 
        commandUsage.name = "**Usage**"; 
        commandUsage.value = `${prefix}${command.name}`;

        let commandCooldown = new Object(); 
        commandCooldown.name = "**Cooldown**"; 
        commandCooldown.value = "None";

        let commandDebug = new Object();
        commandDebug.name = "**Debug**";
        commandDebug.value = "No";
        
        if (command.aliases) commandAliases.value = `${prefix}${command.aliases.join(`, ${prefix}`)}`;
        if (command.usage) commandUsage.value = `${prefix}${command.name} ${command.usage}`;
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
            .setTitle(`${prefix}${command.name}`)
            .setThumbnail("https://cdn.discordapp.com/emojis/779828495932981279.gif?v=1")
            .setDescription(`${command.description}`)
            .addFields(commandProperties)
            .setFooter('Made with ❤️ by avocado#5277');
            
        data.push(commandHelpEmbed);
        
        message.channel.send(data, { split: true });
	},
};