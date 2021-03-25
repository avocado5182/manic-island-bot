module.exports = {
    name: 'pog',
    aliases: ['poggers','pogchamp'],
    description: 'Poggers',
    debug: true,
    category: "fun",
    cooldown: 5,
	execute(message, args) {
        const pog = "<:pog:779795960234246164>";
        message.channel.send(`${pog} poggers!!! ${pog}`);
	},
};
