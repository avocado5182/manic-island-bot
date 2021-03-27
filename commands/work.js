const fs = require('fs');

module.exports = {
    name: "work",
    description: "Work for money to buy products/other goods.",
    aliases: [],
    debug: false,
    category: "economy",
    execute(message, args) {
        const serverJSONPath = `./db/economy/${message.guild.id}.json`;
        let serverJSONObj = {};

        if (fs.existsSync(serverJSONPath)) {
            serverJSONObj = JSON.parse(fs.readFileSync(serverJSONPath));
            if (serverJSONObj.balances == null) {
                // No one has worked yet in the server but there are products/other things
                let balances = [{
                    user: message.author.id,
                    balance: 100
                }];
    
                serverJSONObj.balances = balances;
            } else {
                let user = serverJSONObj.balances.filter(u => u.user === message.author.id);
                if (!user) {
                    // user doesnt exist but other users have balances
                    let balance = {
                        user: message.author.id,
                        balance: 100
                    };

                    serverJSONObj.balances.push(balance);
                } else {
                    // user does exist and other users have balances
                    user.balance += 100;
                }
            }
        } else {
            let balances = [{
                user: message.author.id,
                balance: 100
            }];

            serverJSONObj.balances = balances;
        }

        fs.writeSync(serverJSONPath, JSON.stringify(serverJSONObj));
    }
}