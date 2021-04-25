const { MessageEmbed } = require('discord.js');
const guildJSON = require("../modules/getJSON");

const firstLevelXP = 20;
const xpCoefficient = 40;

function XP(level) {
    if (level === 1) return firstLevelXP;
    return (xpCoefficient * level) - (xpCoefficient - firstLevelXP);
}

const defaultPay = 100;

module.exports = {
    name: "work",
    description: "Work for money to buy products/other goods.",
    aliases: [],
    debug: false,
    category: "economy",
    cooldown: 10,
    execute(message, args) {
        // xpAmount, level
        // if xpAmount is greater than levelup minimum, level ++ and xpAmount %= minimum
        let stats = guildJSON.getKey(message.guild.id, "stats") ?? [];
        let user = stats.find(u => u.user === message.author.id);
        if (user === undefined) {
            user = {
                user: message.author.id,
                balance: 0
            };
            stats.push(user);
        }
        user.xp = user.xp ?? 0;
        user.level = user.level ?? 1;

        let oldLvl = user.level;

        const xpToGet = user.level * 5;
        user.xp += xpToGet;
        
        if (user.xp >= XP(user.level)) {
            user.xp %= XP(user.level);
            user.level++;
        }
        
        guildJSON.setKey(message.guild.id, "stats", stats);

        const payAmt = defaultPay * user.level;
        const newBalance = guildJSON.addBalance(message.guild.id, message.author.id, payAmt);

        const leveledUp = (oldLvl !== user.level);

        const workEmbed = new MessageEmbed()
            .setColor('#00ff99')
            .setTitle('Working')
            .setThumbnail("https://cdn.discordapp.com/emojis/779828495932981279.gif?v=1")
            .setDescription(`You worked and got ${payAmt} currency! Your balance is now ${newBalance}!\nYou also got ${xpToGet} work XP! ${(leveledUp) ? `You are now level ${user.level}!` : `You now have ${user.xp} work XP!`}`)
            .setFooter('Made with ❤️ by avocado#5277');

        message.channel.send([workEmbed], { split: true });
    }
}