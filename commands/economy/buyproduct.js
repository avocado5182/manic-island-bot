const fs = require('fs');
const { MessageEmbed, Guild } = require('discord.js');
const guildJSON = require("../../modules/getJSON");
const { trace } = require('console');

module.exports = {
    name: "buyproduct",
    description: "Buys a product with a given name.",
    aliases: ["buy"],
    debug: false,
    args: true,
    usage: "<product name>",
    category: "economy",
    execute(message, args) {
        try {
            let products = guildJSON.getKey(message.guild.id, "products");
            const givenProductName = args.join(" ");
            
            const product = products.find(p => p.name === givenProductName);
            if (product !== null || product !== undefined) {
                const stats = guildJSON.getKey(message.guild.id, "stats");
                let userStats = stats.find(u => u.user === message.author.id);

                let balance = userStats.balance ?? 0;
                if (balance >= product.price) {
                    // user can buy the product
                    balance -= product.price;
                    userStats.balance = balance;
                    return message.reply(`Product *${product.name}* purchased for ${product.price} currency! You now have ${balance} currency.`);
                }
            } else {
                return message.channel.send("Your given product is invalid. Please try again.");
            }
        } catch(err) {
            // error w/ no products
            console.trace(err);
            return message.channel.send("There are no products to buy. Please try again.");
        }
    }
}