const fs = require('fs');

const Discord = require('discord.js');
const spell = require('spell-checker-js');
const levenshtein = require('js-levenshtein');

const express = require('express');
const {
    messages
} = require('./messages');
const app = express();

app.get('/', (req, res) => {
    res.send("Manic Island is online!");
})

app.listen(3000, console.log("Website open."));

const client = new Discord.Client();

require("dotenv").config();

client.commands = new Discord.Collection();

spell.load('./commands/commands.txt');

// https://stackoverflow.com/a/16684530/14140031
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            /* Recurse into a subdirectory */
            results = results.concat(walk(file));
        } else {
            /* Is a file */
            file_type = file.split(".").pop();
            file_name = file.split(/(\\|\/)/g).pop();
            if (file_type == "js") results.push(file);
        }
    });
    return results;
}

const mainCommandFiles = walk("./commands");

// Adding commands to client.commands

for (const file of mainCommandFiles) {
    const command = require(`${file}`);
    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

// Events

client.once('ready', () => {
    console.log(`Hi there. ${client.user.username} is now online.`);

    // 0 is "Listening to m!help",
    // 1 is one of many random messages
    // 2 is custom msg
    const presenceType = 0;

    client.user.setStatus("online");
    if (presenceType === 0) {
        client.user.setPresence({
            status: 'online',
            activity: {
                type: "LISTENING",
                name: `m!help`
            }
        });
    } else if (presenceType === 1) {
        setInterval(() => {
            function randomIndex(min,max,prev=-1) {
                const random = Math.floor(Math.random() * (max - min)) + min;
                if (random == prev) return randomIndex(min, max, prev);
                return random;
            }
            const message = messages[randomIndex(0, messages.length - 1)];
            console.log(message);
            console.log(typeof message);
            if (typeof message === "object") {
                client.user.setActivity(message[1], { type: message[0] });
            } else if (typeof message === "string") {
                client.user.setActivity(message, { type: "PLAYING" });
            } else {
                client.user.setPresence({
                    status: 'online',
                    activity: {
                        type: "LISTENING",
                        name: `m!help`
                    }
                });
            }
        }, 5000);
    } else if (presenceType === 2) {
        const customMessage = "wrapping soon";
        client.user.setPresence({
            status: 'online',
            activity: {
                type: "PLAYING",
                name: customMessage
            }
        })
    } else {
        // Default to type 0
        client.user.setPresence({
            status: 'online',
            activity: {
                type: 'LISTENING',
                name: `m!help`
            }
        });
    }
});

client.once('disconnect', () => {
    console.error(`${client.user.username} has disconnected. Ahhhhhhh`);

    client.user.setStatus("invisible");
})

client.on('message', message => {
    if (!message.content.startsWith(process.env['PREFIX']) || message.author.bot) return;

    const args = message.content.slice(process.env['PREFIX'].length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) {
        return;
    }
    // if (!command) {
    //     let wrong = spell.check(commandName);
    //     let realName = commandName;

    //     for (let i in mainCommandFiles) {
    //         if (wrong.length == 0) return;
    //         let cname = mainCommandFiles[i];
    //         let cmdName = cname.substring(0, cname.length - 3);

    //         for (j in wrong) {
    //             let dist = levenshtein(commandName, cmdName);
    //             if (dist < 3) realName = cmdName;
    //         }
    //     }

    //     if (realName == commandName)
    //         return message.channel.send(`${process.env['PREFIX']}${commandName} is not a valid command. Try again.`);
    //     else
    //         return [
    //             message.channel.send(`${process.env['PREFIX']}${commandName} is not a valid command.`),
    //             message.channel.send(`Did you mean \`${process.env['PREFIX']}${realName}\`?`)
    //         ];
    // }

    if (command.guildOnly && message.channel.type === 'dm')
        return message.reply(`Sorry, ${process.env['PREFIX']}${commandName} only works in guilds.`);

    if (command.args && !args.length) {
        let reply = `${message.author.username}, No arguments provided. Try again.`;

        if (command.usage)
            reply += `\nThe proper usage would be: \`${process.env['PREFIX']}${commandName} ${command.usage}\``;

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
            return message.channel.send(`<@${message.author.id}> Please wait **${timeLeft.toFixed(1)}** more second(s) before reusing ${process.env['PREFIX']}${commandName}.`)
                .then(msg => {
                    setTimeout(() => {
                        msg.delete();
                    }, timeLeft * 1000);
                });
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

client.login(process.env.TOKEN ?? process.env["TOKEN"]);