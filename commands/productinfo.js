const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "productinfo",
    description: "Sends info about the given product.",
    args: true,
    category: "economy",
    usage: "<product name>",
    execute(message, args) {
        let serverJSONPath = `./db/economy/${message.guild.id}.json`;

        if (fs.existsSync(serverJSONPath)) {
            let serverJSONFile = fs.readFileSync(serverJSONPath);
            let productList = JSON.parse(serverJSONFile).products;
            let givenName = args.join(" ");
            
            let product = productList.find(p => p.name === givenName);
            if (product) {
                message.channel.send("Getting product info...")
                .then(msg => {
                    // Return a product embed

                    // let description = new Object();
                    // description.name = "Description";
                    // description.value = product.description;

                    let price = new Object();
                    price.name = "Price";
                    price.value = product.price;

                    let seller = new Object();
                    seller.name = "Seller";
                    msg.client.users.fetch(product.sellerID)
                    .then(user => {
                        seller.value = user.tag;
                        // Create and send embed
                        const productInfoEmbed = new MessageEmbed()
                        .setColor('#00ff99')
                        .setTitle(`${product.name}`)
                        .setThumbnail("https://cdn.discordapp.com/emojis/779828495932981279.gif?v=1")
                        .setDescription(`${product.description}`)
                        .addFields([price, seller]);

                        return message.channel.send([productInfoEmbed], { split: true })
                        .then(() => msg.delete());
                    })
                    .catch(e => {
                        console.error(e);
                        return message.reply("Something went wrong. Please try again later.");
                    });
                });
            } else {
                return message.reply("The given product doesn't exist. Please try again.");
            }
        } else {
            return message.reply("There are no products to modify. Please create a product first.");
        }
    }
}