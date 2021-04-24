const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "serverinfo",
    description: "Gets info about current guild.",
    aliases: [],
    debug: false,
    async execute(message, args) {
        message.channel.send("**Info for " + message.guild.name + "**");
        
        let serverInfo = [];

        serverInfo.push({
            name: "Creation Date",
            value: `${message.guild.createdAt.getMonth()}/${message.guild.createdAt.getDate()}/${message.guild.createdAt.getFullYear()}`
        });

        const owner = await message.guild.members.fetch(message.guild.ownerID);

        serverInfo.push({
            name: "Owner",
            value: owner
        });

        const bots = await message.guild.members.fetch().then(members => members.filter(m => m.user.bot));
        console.log(bots);

        serverInfo.push({
            name: "Members",
            value: message.guild.memberCount - bots.size
        });

        serverInfo.push({
            name: "Bots",
            value: bots.size
        });

        const infoEmbed = new MessageEmbed()
            .setColor('#00ff99')
            .setTitle(message.guild.name)
            .setThumbnail(`${message.guild.iconURL() || "https://cdn.discordapp.com/attachments/780118992513663007/833923968762904617/manicisland-filler2.png"}`)
            .setDescription("Info about " + message.guild.name)
            .addFields(serverInfo)
            .setFooter('Made with ❤️ by avocado#5277');

        message.channel.send([infoEmbed], { split: true });
    }
};
