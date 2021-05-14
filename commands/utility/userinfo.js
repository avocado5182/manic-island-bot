const { MessageEmbed } = require('discord.js');

function sendMemberInfo(member, msg) {
    let userInfo = [];
    
    userInfo.push({
        name: "Account Creation Date",
        value: `${member.user.createdAt.getMonth() + 1}/${member.user.createdAt.getDate()}/${member.user.createdAt.getFullYear()}`
    });

    userInfo.push({
        name: "Joined Date",
        value: `${member.joinedAt.getMonth() + 1}/${member.joinedAt.getDate()}/${member.joinedAt.getFullYear()}`
    });

    userInfo.push({
        name: "Bot",
        value: `${member.user.bot ? "Yes" : "No"}`
    })

    const infoEmbed = new MessageEmbed()
        .setColor('#00ff99')
        .setTitle(member.user.tag)
        .setThumbnail(`${member.user.avatarURL() ?? "https://cdn.discordapp.com/attachments/780118992513663007/833923968762904617/manicisland-filler2.png"}`)
        .setDescription("Info about " + member.displayName)
        .addFields(userInfo)
        .setFooter('Made with ❤️ by avocado#5277');

    msg.channel.send([infoEmbed], { split: true });
}

module.exports = {
    name: "userinfo",
    description: "Gets info on a user based on id or by mention.",
    aliases: [],
    debug: false,
    category: "utility",
    async execute(message, args) {
        if (args.length > 0) {
            const inputted = message.mentions.members.first() ?? args[0];
            if (inputted === args[0]) {
                // args[0] is likely an id, but we still need to check
                message.guild.members.fetch(args[0])
                .then(member => {
                    sendMemberInfo(member, message);
                })
                .catch(err => {
                    console.error(err);
                    if (err.code === Discord.Constants.APIErrors.UNKNOWN_MEMBER) {
                        return message.channel.send("Invalid member inputted!");
                    }
                    return message.channel.send(`Something went wrong. Here's the error: \n\`\`\`${err}\`\`\``);
                });
            } else {
                // Mentioned a member, inputted is a Member
                sendMemberInfo(inputted, message);
            }
        } else {
            console.log(message);
            const member = await message.guild.members.fetch(message.author.id);
            sendMemberInfo(member, message);
        }
    }
}