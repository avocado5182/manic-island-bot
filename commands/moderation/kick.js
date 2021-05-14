module.exports = {
	name: 'kick',
    description: 'Kick a member',
    guildOnly: true,
    category: "moderation",
    usage: '<user>',
	execute(message, args) {
        if (!message.mentions.users.size) {
            return message.channel.send('You need to tag a user! Please try again');
		}

		const taggedUser = message.mentions.members.first();
        
        if (message.member.hasPermission('KICK_MEMBERS')) {
            taggedUser.kick()
                .catch((error) => {
                    message.channel.send(`<@${message.guild.owner.id}> You need to allow me to kick members.\n**Tip:** *Put your Bots role or Manic Island role above the roles you want to kick.*`);
                    client.users.fetch('543817742487388179').then((user) => {
                        user.send(`<@${message.guild.owner.id}> of **${message.guild.name}** needs to configure their bot instance. DM them to help them if they need help\n${error}`);
                    });
                });
        } else {
            message.channel.send(`<@${message.author.id}> You cannot kick members.`);
            // message.channel.send(`<@${message.author.id}> You cannot kick members. Ask a moderator if you think a member is breaking the rules.`);
        }
	},
};
