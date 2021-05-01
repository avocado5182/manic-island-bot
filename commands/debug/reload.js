module.exports = {
	name: 'reload',
	description: 'Reloads a command',
    args: true,
    category: "debug",
    usage: '<command name>',
	execute(message, args) {
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
            || undefined;
      
        if (command != undefined) {
            delete require.cache[require.resolve(`./${command.name}.js`)];

            try {
                const newCommand = require(`./${command.name}.js`);
                message.client.commands.set(newCommand.name, newCommand);
                return message.channel.send(`Command \`${command.name}\` was reloaded!`);
            } catch (error) {
                console.error(error);
                return message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
            }        
        } else {
            return message.reply("That command does not exist. Please try again.");
        }
	}
};