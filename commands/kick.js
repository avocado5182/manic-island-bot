module.exports = {
	name: 'kick',
    description: 'Poggers',
    guildOnly: true,
    usage: '<user>',
	execute(message, args) {
        const pog = "<:pog:779795960234246164>";
        message.channel.send(pog);
	},
};
