const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "work",
    description: "Work for money to buy products/other goods.",
    aliases: [],
    debug: false,
    category: "economy",
    cooldown: 10,
    execute(message, args) {
        const serverJSONPath = `./db/economy/${message.guild.id}.json`;
        let serverJSONObj = {};

        let resultingBalance;

        if (fs.existsSync(serverJSONPath)) {
            serverJSONObj = JSON.parse(fs.readFileSync(serverJSONPath));
            if (serverJSONObj.balances == null) {
                // No one has worked yet in the server but there are products/other things
                let balances = [{
                    user: message.author.id,
                    balance: 100
                }];
    
                resultingBalance = 100;
                serverJSONObj.balances = balances;
            } else {
                let userIndex = serverJSONObj.balances.findIndex(u => u.user === message.author.id);
                let user = serverJSONObj.balances[userIndex];
                if (!user) {
                    // user doesnt exist but other users have balances
                    let balance = {
                        user: message.author.id,
                        balance: 100
                    };

                    resultingBalance = 100;
                    serverJSONObj.balances.push(balance);
                } else {
                    // user does exist and other users have balances
                    serverJSONObj.balances[userIndex].balance = user.balance + 100;
                    resultingBalance = serverJSONObj.balances[userIndex].balance;
                }
            }
        } else {
            let balances = [{
                user: message.author.id,
                balance: 100
            }];

            resultingBalance = 100;
            serverJSONObj.balances = balances;
        }

        fs.writeFileSync(serverJSONPath, JSON.stringify(serverJSONObj));
        const helpEmbed = new MessageEmbed()
            .setColor('#00ff99')
            .setTitle('Working')
            .setThumbnail("https://cdn.discordapp.com/emojis/779828495932981279.gif?v=1")
            .setDescription(`<@${message.author.id}>, you worked for 1 hour and got 100 currency! Your balance is now ${resultingBalance}!`)
            .setFooter('Made with ❤️ by avocado#5277');

        message.channel.send([helpEmbed], { split: true });
    }
}