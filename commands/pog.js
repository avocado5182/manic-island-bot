module.exports = {
    name: 'pog',
    aliases: ['poggers','pogchamp'],
    description: 'Poggers',
    debug: true,
    category: "fun",
    cooldown: 5,
	execute(message, args) {
        message.client.guilds.fetch('767327205646532648')
        .then(g => {
            const pogmoji = g.emojis.cache.get((args[0] != null) ? args[0] : '767327205646532648');
            message.channel.send(`${pogmoji.toString()} poggers!!! ${pogmoji.toString()}`);
        });
	},
};
