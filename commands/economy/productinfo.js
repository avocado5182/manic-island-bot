const fs = require('fs');
const guildJSON = require("../../modules/getJSON");
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "productinfo",
    description: "Sends info about the given product.",
    args: true,
    category: "economy",
    usage: "<product name>",
    aliases: ["product", "p"],
    guildOnly: true,
    execute(message, args) {
        const products = guildJSON.getKey(message.guild.id, "products") ?? {};
        if (products.length > 0 || (products != null || products != undefined)) {
            // valid products object
            // Return a product embed
            const givenProductName = args.join(" ").toLowerCase();
            const product = products.find(p => p.name.toLowerCase() === givenProductName);

            let price = new Object();
            price.name = "Price";
            price.value = product.price;

            let seller = new Object();
            seller.name = "Seller";
            message.client.users.fetch(product.sellerID)
            .then(user => {
                seller.value = user.tag;
                // Create and send embed
                const productInfoEmbed = new MessageEmbed()
                .setColor('#00ff99')
                .setTitle(`${product.name}`)
                .setThumbnail("https://cdn.discordapp.com/emojis/779828495932981279.gif?v=1")
                .setDescription(`${product.description}`)
                .addFields([price, seller]);

                return message.channel.send([ productInfoEmbed ], { split: true })
            })
            .catch(err => {
                console.error(err);
                return message.reply("Something went wrong. Please try again later.");
            });
        } else {
            return message.reply("The given product doesn't exist. Please try again.");
        }
    }
}