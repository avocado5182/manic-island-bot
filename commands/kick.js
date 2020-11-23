module.exports = {
	name: 'kick',
    description: 'Poggers',
    guildOnly: true,
    usage: '<user>',
	execute(message, args) {
        if (!message.mentions.users.size) {
            return message.channel.send('You need to tag a user! Please try again');
		}

		const taggedUser = message.mentions.members.first();

        console.log(`You wanted to kick ${taggedUser.user.username}`);
        
        if (message.member.hasPermission('KICK_MEMBERS')) {
            taggedUser.kick()
                .catch((error) => {
                    message.channel.send(`I do not have sufficient permissions to kick members! Check your role settings and try again.\n**Error:** *${error}*`);
                });
        } else {
            message.channel.send('You do not have permissions to kick members!');
        }
	},
};
