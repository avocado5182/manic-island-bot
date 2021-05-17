const { MessageEmbed } = require("discord.js");
const guildJSON = require("../../modules/getJSON");
const shopItems = require("../../modules/shopItems");

const Pagination = require("discord-paginationembed");


module.exports = {
    name: "inventory",
    description: "Sends an embed with your inventory.",
    aliases: ["inv"],
    category: "economy",
    debug: false,
    guildOnly: true,
    execute(message, args) {
        let stats = guildJSON.getKey(message.guild.id, "stats");
        let user = stats.find(u => u.user === message.author.id);

        if (!user) return message.reply("you do not have any items. Please try again.");

        let inv = user.inventory ?? {};
        if (inv.length === 0) return message.reply("you do not have any items. Please try again.");

        const invKeys = Object.keys(inv);

        let fieldsArr = [];

        for (key of invKeys) {
            console.log(key);
            const amt = inv[key];
            console.log(amt);

            const item = shopItems.list.find(i => i.id === key);

            fieldsArr.push({
                // name: `\`${amt}\` ${item.name ?? "Unnamed"}s`,
                name: `${item.name ?? "Unnamed"} - \`${amt}\``,
                value: item.description ?? "No description provided."
            });
        }

        // https://stackoverflow.com/a/11318797
        let embedFieldsArr = [], size = 7;

        while (fieldsArr.length > 0)
            embedFieldsArr.push(fieldsArr.splice(0, size));

        let embedArr = [];
        for (let i = 0; i < embedFieldsArr.length; i++) {
            let embed = new MessageEmbed()
                .setColor('#00ff99')
                .setTitle(`${message.author.displayName}'s inventory`)
                .setThumbnail("https://cdn.discordapp.com/emojis/779828495932981279.gif?v=1")
                // .setDescription(`The list of shop items`)
                .addFields(embedFieldsArr[i])
                .setFooter('Made with ❤️ by avocado#5277');

            embedArr.push(embed);
        }

        const invEmbed = new Pagination.Embeds()
            .setArray(embedArr)
            .setColor('#00ff99')
            .setTitle(`${message.guild.member(message.author.id).displayName}'s inventory`)
            .setThumbnail("https://cdn.discordapp.com/emojis/779828495932981279.gif?v=1")
            // .setDescription(`The list of shop items`)
            .setFooter('Made with ❤️ by avocado#5277')
            // .setAuthorizedUsers([message.author.id])
            .setChannel(message.channel)
            .setPageIndicator(true)
            .setDisabledNavigationEmojis(['delete', 'jump'])
            // .addFunctionEmoji('❌', (_, instance) => instance.clientAssets.message.delete())
            // .setEmojisFunctionAfterNavigation(true)
            .build();
    }
}