const { MessageEmbed } = require('discord.js');
const guildJSON = require("../../modules/getJSON");

const firstLevelXP = 20;
const xpCoefficient = 40;

function XP(level) {
    if (level === 1) return firstLevelXP;
    return (xpCoefficient * level) - (xpCoefficient - firstLevelXP);
}

module.exports = {
    name: "level",
    description: "Sends an embed with all of your levels.",
    aliases: [],
    debug: false,
    usage: "<type (optional)>",
    category: "utility",
    execute(message, args) {
        if (args[0]) {
            // type inputted
            switch(args[0].toLowerCase()) {
                case "work":
                    const stats = guildJSON.getKey(message.guild.id, "stats");
                    const user = stats.find(u => u.user === message.author.id);
                    const workLevel = user.level ?? 1;
                    const xpInLevel = user.xp ?? 0;
                    let workXP = xpInLevel;
                    for (let i = 1; i <= workLevel; i++) {
                        workXP += XP(i - 1);
                    }
                    if (workXP < 0) workXP += firstLevelXP;

                    const levelFields = [
                        {
                            name: "Level",
                            value: workLevel,
                            inline: true
                        },
                        {
                            name: "Progress",
                            value: `${xpInLevel}/${XP(workLevel)}`,
                            inline: true
                        },
                        {
                            name: "Total XP",
                            value: workXP
                        },
                    ]

                    const levelEmbed = new MessageEmbed()
                        .setColor('#00ff99')
                        .setTitle(`Work XP for ${message.author.username}`)
                        .addFields(levelFields)
                        .setThumbnail(`${message.author.avatarURL() ?? "https://cdn.discordapp.com/attachments/780118992513663007/833923968762904617/manicisland-filler2.png"}`)
                        .setFooter(message.guild.name, message.guild.iconURL());

                    message.channel.send([levelEmbed], { split: true });
                    break;
                default:
                    message.reply("Invalid level type entered. The valid types are `work`.");
                    break;
            }
        } else {
            
        }
    }
}