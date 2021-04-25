const Canvas = require("canvas");
const { fillTextWithTwemoji } = require('node-canvas-with-twemoji');

const { MessageAttachment } = require("discord.js");

module.exports = {
	name: "fake-message",
	description: "Fakes a discord message",
	aliases: ["fake-msg", "fakemessage"],
	debug: false,
	args: true,
	async execute(message, args) {
		// https://discordjs.guide/popular-topics/canvas.html

		let user = (message.mentions.members.size > 0) ? message.mentions.members.first().user : message.author;
		let text = args.join(" ");

		const canvas = Canvas.createCanvas(700, 250);
		const ctx = canvas.getContext('2d');

		ctx.fillStyle = "#36393f";
		ctx.fillRect(0, 0, 1000, 250);

		const avatarSize = 64;
		const padding = 16;
		
		const guildMember = await message.guild.members.fetch(user.id)
		
		const textOffset = padding * 2 + avatarSize;
		// ctx.font = "24px sans-serif";
		ctx.font = "24px Whitney";
		ctx.textBaseline = "hanging";
		ctx.fillStyle = guildMember.displayHexColor ?? "#ffffff";
		ctx.fillText(guildMember.displayName, textOffset, padding, 1000 - textOffset - padding);
		
		const authorTextMetrics = ctx.measureText(guildMember.displayName);
		const timestampXOff = padding * 3 + avatarSize + authorTextMetrics.width;
		ctx.font = "16px Whitney";
		ctx.fillStyle = "#72767d";
		const timestamp = `${message.createdAt.getUTCHours()}:${message.createdAt.getUTCMinutes().toString().padStart(2, 0)} ${(message.createdAt.getUTCHours() < 12) ? "AM" : "PM"}`;
		ctx.fillText(`Today at  ${timestamp}`, timestampXOff, padding + 7, 1000 - timestampXOff - padding);
			
		ctx.font = "22px Whitney";
		ctx.fillStyle = "#ffffff";
		// ctx.fillText(text, textOffset, padding * 2.8, 1000 - textOffset - padding);
		await fillTextWithTwemoji(ctx, text, textOffset, padding * 2.8);

		// Pick up the pen
		ctx.beginPath();
		// Start the arc to form a circle
		ctx.arc(padding + (avatarSize / 2), padding + (avatarSize / 2), avatarSize / 2, 0, Math.PI * 2, true);
		// Put the pen down
		ctx.closePath();
		// Clip off the region you drew on
		ctx.clip();

		const avatar = await Canvas.loadImage(user.displayAvatarURL({
			format: 'jpg'
		}));
		ctx.drawImage(avatar, padding, padding, avatarSize, avatarSize);

		const attachment = new MessageAttachment(canvas.toBuffer(), `message-${message.id}.png`);

		message.channel.send(attachment);
	}
}