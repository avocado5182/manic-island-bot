const { MessageEmbed } = require('discord.js');
const guildJSON = require("../modules/getJSON");

const firstLevelXP = 20;
const XPUpRate = 0.5; // This means that for each level itll add 20 * 0.5 xp to the xp needed to level up

function GetLevelFromTotalXP(totalXP, round=true) {
    if (totalXP < firstLevelXP) return 1;
    function XP(xp) {
        return (1/((1/XPUpRate)*firstLevelXP) * xp) + 1/(((1/XPUpRate)*firstLevelXP)/10);
    }
    return (round) ? Math.floor(XP(totalXP)) + 1 : XP(totalXP) + 1;
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

        // setBalance(message.guild.id, message.author.id, 100);
        let stats = guildJSON.getKey(message.guild.id, "stats");
        let user = stats.find(u => u.user === message.author.id);
        if (user === undefined) {
            user = {
                user: message.author.id,
                balance: 0
            };
            stats.push(user);
        }
        user.xp = user.xp ?? 0;
        const userLevel = GetLevelFromTotalXP(user.xp);
        const xpToGet = 5 * userLevel;
        user.xp += xpToGet;
        
        const newStats = guildJSON.setKey(message.guild.id, "stats", stats);
        
        const payAmt = defaultPay * GetLevelFromTotalXP(user.xp);
        
        const newBalance = guildJSON.addBalance(message.guild.id, message.author.id, payAmt);

        // #region old 
            // if (fs.existsSync(serverJSONPath)) {
            //     serverJSONObj = JSON.parse(fs.readFileSync(serverJSONPath));
            //     if (serverJSONObj.balances == null) {
            //         // No one has worked yet in the server but there are products/other things
            //         let balances = [{
            //             user: message.author.id,
            //             balance: 100
            //         }];
        
            //         resultingBalance = 100;
            //         serverJSONObj.balances = balances;
            //     } else {
            //         let userIndex = serverJSONObj.balances.findIndex(u => u.user === message.author.id);
            //         let user = serverJSONObj.balances[userIndex];
            //         if (!user) {
            //             // user doesnt exist but other users have balances
            //             let balance = {
            //                 user: message.author.id,
            //                 balance: 100
            //             };

            //             resultingBalance = 100;
            //             serverJSONObj.balances.push(balance);
            //         } else {
            //             // user does exist and other users have balances
            //             serverJSONObj.balances[userIndex].balance = user.balance + 100;
            //             resultingBalance = serverJSONObj.balances[userIndex].balance;
            //         }
            //     }
            // } else {
            //     let balances = [{
            //         user: message.author.id,
            //         balance: 100
            //     }];

            //     resultingBalance = 100;
            //     serverJSONObj.balances = balances;
            // }

            // fs.writeFileSync(serverJSONPath, JSON.stringify(serverJSONObj));
        // #endregion
        const helpEmbed = new MessageEmbed()
            .setColor('#00ff99')
            .setTitle('Working')
            .setThumbnail("https://cdn.discordapp.com/emojis/779828495932981279.gif?v=1")
            .setDescription(`You worked and got ${payAmt} currency! Your balance is now ${newBalance}!\nYou also got ${xpToGet} work XP! You now have ${user.xp} work XP!`)
            .setFooter('Made with ❤️ by avocado#5277');

        message.channel.send([helpEmbed], { split: true });
    }
}