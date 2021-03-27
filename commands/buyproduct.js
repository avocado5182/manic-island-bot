const fs = require('fs');
const { MessageEmbed } = require('discord.js');


module.exports = {
    name: "buyproduct",
    description: "Buys a product with a given name.",
    aliases: ["buy"],
    debug: false,
    args: true,
    usage: "<product name>",
    category: "economy",
    execute(message, args) {
        const serverJSONPath = `./db/economy/${message.guild.id}.json`;
        let serverJSONObj = {};

        if (fs.existsSync(serverJSONPath)) {
            serverJSONObj = JSON.parse(fs.readFileSync(serverJSONPath));

            if (serverJSONObj.balances === null) {
                return message.channel.send("You cannot buy anything since you have no currency. Please get some currency and try again.");
            } else if (serverJSONObj.products === null) {
                return message.channel.send("You cannot buy anything since there are no products. Please create a product and try again.");
            } else {
                // Both balances and products exist

                // Product check
                let givenProductName = args.join(" ");
                let productIndex = serverJSONObj.products.findIndex(p => p.name === givenProductName);
                let product = serverJSONObj.products[productIndex];
                if (product !== null) {
                    // Product found with given name
                    let userIndex = serverJSONObj.balances.findIndex(b => b.user === message.author.id);
                    let user = serverJSONObj.balances[userIndex];
                    if (user !== null) {
                        // Found balance too
                        if (product.price <= user.balance) {
                            // Can afford
                            serverJSONObj.balances[userIndex].balance -= product.price;
                            fs.writeFileSync(serverJSONPath, JSON.stringify(serverJSONObj));
                            return message.reply(`Product *${product.name}* purchased for ${product.price} currency! You now have ${serverJSONObj.balances[userIndex].balance} currency.`);
                        } else {
                            // Cannot afford
                            return message.channel.send("You cannot afford the specified product. Please try again.");
                        }
                    } else {
                        // User has no balance object
                        return message.channel.send("You have not gotten any currency yet. Please get some and try again.");
                    }
                } else {
                    // Product doesn't exist
                    return message.channel.send("The specified product does not exist. Are you mispelling the name of it? Please try again.");
                }
            }
        } else {
            // No <GUILDID>.json file
            return message.channel.send(`<@${message.author.id}> It seems like you have not started using the economy commands. Please create a product, get some currency, and try again.`);
        }
    }
}