module.exports = {
    name: 'pog',
    aliases: ['poggers','pogchamp'],
    description: 'Poggers',
    debug: true,
    category: "fun",
    cooldown: 5,
	execute(message, args) {
        if (args.length != 0) return;
        message.client.guilds.fetch('767327205646532648')
        .then(g => {
            const pogmoji = g.emojis.cache.get((args[0] != null) ? args[0] : '839856407260299314');
            message.channel.send(`${pogmoji.toString()} poggers!!! ${pogmoji.toString()}`);
        })
        .catch(err => {
            message.channel.send("<:pog:839856407260299314> pog! <:pog:839856407260299314>");
        });
	},
};
