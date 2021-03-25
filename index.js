const fs = require('fs');

const Discord = require('discord.js');
const spell = require('spell-checker-js');
const levenshtein = require('js-levenshtein');

const client = new Discord.Client();

client.commands = new Discord.Collection();

spell.load('./commands/commands.txt');

let mainCommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Adding commands to client.commands

for (const file of mainCommandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

// Events

client.once('ready', () => {
    console.log(`Hi there. ${client.user.username} is now online.`);

    client.user.setPresence({
        status: 'online',
        activity: {
            type: 'PLAYING',
            name: `m!help`
        }
    });
});

client.once('disconnect', () => {
    console.error(`${client.user.username} has disconnected. Ahhhhhhh`);

    client.user.setPresence({
        status: 'invisible'
    });
})

client.on('message', message => {
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) {
        let wrong = spell.check(commandName);
        let realName = commandName;

        for (let i in mainCommandFiles) {
            if (wrong.length == 0) return;
            let cname = mainCommandFiles[i];
            let cmdName = cname.substring(0, cname.length - 3);

            for (j in wrong) {
                let dist = levenshtein(commandName, cmdName);
                if (dist < 3) realName = cmdName;
            }
        }

        if (realName == commandName)
            return message.channel.send(`${process.env.PREFIX}${commandName} is not a valid command. Try again.`);
        else
            return [
                message.channel.send(`${process.env.PREFIX}${commandName} is not a valid command.`),
                message.channel.send(`Did you mean \`${process.env.PREFIX}${realName}\`?`)
            ];
    }

    if (command.guildOnly && message.channel.type === 'dm')
        return message.reply(`Sorry, ${process.env.PREFIX}${commandName} only works in guilds.`);

    if (command.args && !args.length) {
        let reply = `${message.author.username}, No arguments provided. Try again.`;

        if (command.usage)
            reply += `\nThe proper usage would be: \`${process.env.PREFIX}${command.name} ${command.usage}\``;

        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name))
        cooldowns.set(command.name, new Discord.Collection());

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send(`<@${message.author.id}> Please wait **${timeLeft.toFixed(1)}** more second(s) before reusing ${process.env.PREFIX}${commandName}.`);
        }
    } else {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.trace(error);
        message.channel.send(`**Haha error go brrrr:**\n${error}`);
    }
});

// Client login

client.login(process.env.TOKEN);