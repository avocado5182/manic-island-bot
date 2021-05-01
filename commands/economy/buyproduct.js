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
        const JSONpath = `./db/economy/${message.guild.id}.json`;
        let JSONobj = {};

        if (fs.existsSync(JSONpath)) {
            JSONobj = JSON.parse(fs.readFileSync(JSONpath));

            if (JSONobj.stats === null) {
                return message.channel.send("You cannot buy anything since you have no currency. Please get some currency and try again.");
            } else if (JSONobj.products === null) {
                return message.channel.send("You cannot buy anything since there are no products. Please create a product and try again.");
            } else {
                // Both balances and products exist

                // Product check
                let givenProductName = args.join(" ");
                let product = JSONobj.products.find(p => p.name === givenProductName);
                if (product != null || product != undefined) {
                    // Product found with given name
                    let userIndex = JSONobj.stats.findIndex(b => b.user === message.author.id);
                    let user = JSONobj.stats[userIndex];
                    if (user !== null) {
                        // Found balance too
                        if (product.price <= user.balance) {
                            // Can afford
                            JSONobj.stats[userIndex].balance -= product.price;
                            fs.writeFileSync(JSONpath, JSON.stringify(JSONobj));
                            return message.reply(`Product *${product.name}* purchased for ${product.price} currency! You now have ${JSONobj.stats[userIndex].balance} currency.`);
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
                    return message.channel.send("The specified product does not exist. Are you mispelling the name of it? Please try again. Note that all product names are case sensitive.");
                }
            }
        } else {
            // No <GUILDID>.json file
            return message.channel.send(`<@${message.author.id}> It seems like you have not started using the economy commands. Please create a product, get some currency, and try again.`);
        }
    }
}