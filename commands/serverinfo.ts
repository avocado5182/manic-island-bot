import { EmbedFieldData, Message, MessageEmbed } from "discord.js";

module.exports = {
    name: "serverinfo",
    description: "Gets info about current guild.",
    aliases: [],
    debug: false,
    execute(message: Message, args: String[]) {
        message.channel.send(`**Info for ${message.guild.name}**`);
        let serverInfo: EmbedFieldData[];

        
        serverInfo.push({
            name: "Creation Date",
            value: message.guild.createdAt.getDate
        });

        serverInfo.push({
            name: "Owner",
            value: message.guild.owner.user.tag
        });
            
        serverInfo.push({
            name: "Members",
            value: message.guild.memberCount
        });

        const infoEmbed: MessageEmbed = new MessageEmbed()
            .setColor('#00ff99')
            .setTitle(message.guild.name)
            .setThumbnail("https://cdn.discordapp.com/emojis/779828495932981279.gif?v=1")
            .setDescription(`Info about ${message.guild.name}`)
            .addFields(serverInfo)
            .setFooter('Made with ❤️ by avocado#5277');

        message.channel.send(infoEmbed, { split: true });
    }
}