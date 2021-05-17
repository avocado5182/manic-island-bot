const shopItems = require("../../modules/shopItems");
const { MessageEmbed } = require("discord.js");
const Pagination = require("discord-paginationembed");

module.exports = {
    name: "shop",
    description: "Sends an embed with all shop items (not user-created products).",
    aliases: [],
    category: "economy",
    debug: false,
    execute(message, args) {
        const fieldsArr = [];
        const items = shopItems.list;

        items.forEach(item => {
            fieldsArr.push({
                name: `${item.name ?? "Unnamed Item"} - ${item.price ?? 0} currency`,
                value: item.description ?? "No description provided.",
            });
        });

        // https://stackoverflow.com/a/11318797
        let embedFieldsArr = [], size = 7;
    
        while (fieldsArr.length > 0)
            embedFieldsArr.push(fieldsArr.splice(0, size));

        let embedArr = [];
        for (let i = 0; i < embedFieldsArr.length; i++) {
            let embed = new MessageEmbed()
                .setColor('#00ff99')
                .setTitle(`Shop Item List for ${message.guild.name}`)
                .setThumbnail("https://cdn.discordapp.com/emojis/779828495932981279.gif?v=1")
                .setDescription(`The list of shop items`)
                .addFields(embedFieldsArr[i])
                .setFooter('Made with ❤️ by avocado#5277');

            embedArr.push(embed);
        }

        const shopEmbed = new Pagination.Embeds()
            .setArray(embedArr)
            .setColor('#00ff99')
            .setTitle(`Shop Item List for ${message.guild.name}`)
            .setThumbnail("https://cdn.discordapp.com/emojis/779828495932981279.gif?v=1")
            .setDescription(`The list of shop items`)
            .setFooter('Made with ❤️ by avocado#5277')
            .setAuthorizedUsers([message.author.id])
            .setChannel(message.channel)
            .setPageIndicator(true)
            .setDisabledNavigationEmojis(['delete', 'jump'])
            // .addFunctionEmoji('❌', (_, instance) => instance.clientAssets.message.delete())
            // .setEmojisFunctionAfterNavigation(true)
            .build();
    }
}