const fs = require('fs');
const guildJSON = require("../../modules/getJSON");

module.exports = {
    name: "removeproduct",
    description: "Removes a product based on its name",
    args: true,
    category: "economy",
    usage: "<product name/id>",
    guildOnly: true,
    execute(message, args) {
        const products = guildJSON.getKey(message.guild.id, "products") ?? {};

        if (products && products.length > 0) { 
            const givenName = args.join(" ");
            const product = products.find(p => p.name.toLowerCase() === givenName.toLowerCase());
            if (product) {
                if (product.sellerID === message.author.id) {
                    message.reply(`Are you sure you want to remove the product *${product.name}*?`)
                    .then(msg => {
                        msg.react("✅").then(() => msg.react("❌"))
                        .then(() => {
                            const reactionFilter = (reaction, user) => (reaction.emoji.name === "✅" || reaction.emoji.name === "❌") && user.id === product.sellerID;
                            msg.awaitReactions(reactionFilter, {
                                max: 1,
                                time: 30000,
                                errors: ['time']
                            })
                            .then(reacted => {
                                // User reacted
                                if (reacted.get("✅")) {
                                    // Remove it
                                    let productIndex = productList.findIndex(p => p === product);
                                    products.splice(productIndex, 1);
                                    guildJSON.setKey(message.guild.id, "products", products);
                                    return message.channel.send(`Your product *${product.name}* was removed.`)
                                } else if (reacted.get("❌")) {
                                    return message.channel.send("Okay. Your product was not removed.");
                                }
                            }).catch(err => {
                                console.error(err);
                                return message.channel.send(`${message.guild.member(message.author).displayName}, you did not reply in time or something else went wrong. Please try again`);
                            });
                        });
                    });
                } else {
                    return message.channel.send(`${message.guild.member(message.author).displayName}, You can't remove that product because you are not the seller of it. \nYou can ask the seller if you would like for the product to be removed.`);
                }
            } else {
                return message.channel.send(`${message.guild.member(message.author).displayName}, The given product doesn't exist. Please try again.`);
            }
        } else {
            return message.channel.send(`${message.guild.member(message.author).displayName}, There are no products to remove. Please create a product and try again.`);
        }
    }
}