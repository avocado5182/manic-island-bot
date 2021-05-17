const fs = require("fs");
const { opendir } = require("fs/promises");
const { readdir } = require('fs').promises;
const { resolve } = require('path');
const path = require("path");
require("dotenv").config();

// https://stackoverflow.com/a/1026087 first part
const uppercaseFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// nounToUse is for when its doing message.channel.send()
async function reloadAtPath(pathToReload, message, nounToUse = "file") {
    try {
        const files = await opendir(pathToReload);
        for await (const dirent of files) {
            const filePath = path.join(pathToReload, dirent.name);
            delete require.cache[require.resolve(filePath)];
            try {
                const newFile = require(filePath);
                message.channel.send(`${uppercaseFirstLetter(nounToUse)} \`${dirent.name}\` was reloaded!`);
            } catch (err) {
                console.error(err);
                message.channel.send(`There was an error while reloading a ${nounToUse} \`${dirent.name}\`:\n\`${err.message}\``);
            }
        }
    } catch (err) {
        console.trace(err);
        return message.reply(`There was an error while reloading ${nounToUse}s: \n\`\`\`${err}\`\`\``);
    }
}

// https://stackoverflow.com/a/45130990
async function getFiles(dir) {
    const dirents = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
}

async function reloadAtPathFS(pathToReload, message, nounToUse = "file") {
    try {
        // const files = walk(pathToReload);
        getFiles(pathToReload)
        .then(files => {
            console.log(files);
            for (const filePath of files) {
                if (!filePath.endsWith("js")) continue;
                console.log(require.cache[require.resolve(filePath)]);
                delete require.cache[require.resolve(filePath)];
                const splitFilePath = filePath.split("/");
                const fileName = splitFilePath[splitFilePath.length - 1];

                try {
                    const newFile = require(filePath);
                    console.log(newFile);
                    message.channel.send(`${uppercaseFirstLetter(nounToUse)} \`${fileName}\` was reloaded!`);
                } catch (err) {
                    console.error(err);
                    message.channel.send(`There was an error while reloading a ${nounToUse} \`${fileName}\`:\n\`${err.message}\``);
                }

                console.log("-----------------------");
            }
        });
    } catch (err) {
        console.trace(err);
        return message.reply(`There was an error while reloading ${nounToUse}s: \n\`\`\`${err}\`\`\``);
    }
}

module.exports = {
    name: 'reload',
    description: 'Reloads a command',
    args: true,
    category: "debug",
    usage: '<command name>',
    hidden: true,
    async execute(message, args) {
        if (message.author.id !== (process.env.OWNER_ID ?? process.env["OWNER_ID"])) return;
        const commandName = args[0].toLowerCase();

        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)) || undefined;

        if (command != undefined) {
            // delete require.cache[require.resolve(`./${command.name}.js`)];

            // path is __dirname.substring(0, this.category.length)/category/command.js, the .substring
            // is to remove the debug (or whatever category this is)/ at the end of __dirname
            const commandPath = path.join(__dirname.substring(0, __dirname.length - this.category.length), command.category ?? "", `${command.name}.js`);
            delete require.cache[require.resolve(commandPath)];

            try {
                const newCommand = require(`../${command.category ?? ""}/${command.name}`);
                message.client.commands.set(newCommand.name, newCommand);
                return message.channel.send(`Command \`${command.name}\` was reloaded!`);
            } catch (error) {
                console.error(error);
                return message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
            }
        } else {
            if (commandName === "modules" || commandName === "commands" || commandName === "all") {
                let modulesPath = ""
                let commandsPath = "";

                if (commandName === "modules" || commandName === "all") {
                    modulesPath = path.join(__dirname.substring(0, __dirname.length - this.category.length - "commands/".length), "modules");
                    await reloadAtPath(modulesPath, message, "module");
                }

                if (commandName === "commands" || commandName === "all") {
                    commandsPath = __dirname.substring(0, __dirname.length - this.category.length);
                    reloadAtPathFS(commandsPath, message, "command")
                    .then(() => {
                        if (commandName === "all")
                            return message.reply("everything has finished reloading!");
                    });
                }
                
                if (commandName === "modules") {
                    return message.reply("all modules have finished reloading!");
                } // commands are stupid because idk
            }

            // #region old
                // if (commandName === "modules") {
                //     const modulesPath = path.join(__dirname.substring(0, __dirname.length - this.category.length - "commands/".length), "modules");
                //     reloadAtPath(modulesPath, message, "module");

                //     // return message.reply("Reloaded modules!");
                //     return;
                // } else if (commandName === "commands") {
                //     const commandsPath = __dirname.substring(0, __dirname.length - this.category.length);
                //     await reloadAtPathFS(commandsPath, message, "command");

                //     return message.reply("everything has finished reloading!");
                // } else if (commandName === "all") {
                //     // reloads commands AND MODULES
                //     const modulesPath = path.join(__dirname.substring(0, __dirname.length - this.category.length - "commands/".length), "modules/");
                //     const commandsPath = __dirname.substring(0, __dirname.length - this.category.length);

                //     await reloadAtPathFS(commandsPath, message, "command");
                //     await reloadAtPath(modulesPath, message, "module");

                //     return message.reply("everything has finished reloading!");
                // }
            // #endregion
            return message.reply("That command does not exist. Please try again.");
        }
    }
};