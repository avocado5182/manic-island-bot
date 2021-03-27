const fs = require('fs');
const { MessageEmbed } = require("discord.js");
const Pagination = require("discord-paginationembed");

module.exports = {
    name: "products",
    description: "Lists all the products in your server.",
    aliases: ["plist", "productlist"],
    debug: false,
    category: "economy",
    execute(message, args) {
        const serverJSONPath = `./db/economy/${message.guild.id}.json`;
        let serverJSONObj = {};

        if (fs.existsSync(serverJSONPath)) {
            serverJSONObj = JSON.parse(fs.readFileSync(serverJSONPath));

            if (serverJSONObj.products !== null) {
                // Will contain objects for use in the sent embed
                let fieldsArr = [];

                for (let product of serverJSONObj.products) {
                    let productObj = {
                        name: `${product.name} - ${product.price} currency`,
                        value: product.description
                    };

                    fieldsArr.push(productObj);
                }

                // https://stackoverflow.com/a/11318797
                let embedFieldsArr = [], size = 7;
    
                while (fieldsArr.length > 0)
                    embedFieldsArr.push(fieldsArr.splice(0, size));

                let embedArr = [];
                for (let i = 0; i < embedFieldsArr.length; i++) {
                    let embed = new MessageEmbed()
                        .setColor('#00ff99')
                        .setTitle(`Product List for ${message.guild.name}`)
                        .setThumbnail("https://cdn.discordapp.com/emojis/779828495932981279.gif?v=1")
                        .setDescription(`The list of products in ${message.guild.name}`)
                        .addFields(embedFieldsArr[i])
                        .setFooter('Made with ❤️ by avocado#5277');

                    embedArr.push(embed);
                }

                console.log(embedArr);

                let listEmbed = new Pagination.Embeds()
                    .setArray(embedArr)
                    .setColor('#00ff99')
                    .setTitle(`Product List for ${message.guild.name}`)
                    .setThumbnail("https://cdn.discordapp.com/emojis/779828495932981279.gif?v=1")
                    .setDescription(`The list of products in ${message.guild.name}`)
                    .setFooter('Made with ❤️ by avocado#5277')
                    .setAuthorizedUsers([message.author.id])
                    .setChannel(message.channel)
                    .setPageIndicator(true)
                    .build();
            } else {
                return message.channel.send("There are no products to list. Please create a product and try again.");
            }
        } else {
            return message.channel.send("There are no products to list. Please create a product and try again.");
        }
    }
}