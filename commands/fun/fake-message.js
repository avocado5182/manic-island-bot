const path = require('path');

const Canvas = require("canvas");
const { fillTextWithTwemoji } = require('node-canvas-with-twemoji-and-discord-emoji');

const { MessageAttachment } = require("discord.js");

function fontFile(name) {
	return path.join(__dirname, "../", name);
}

module.exports = {
	name: "fake-message",
	description: "Fakes a discord message",
	aliases: ["fake-msg", "fakemessage", "fakemsg"],
	debug: false,
	args: true,
	category: "fun",
	async execute(message, args) {
		// https://discordjs.guide/popular-topics/canvas.html

		let user = (message.mentions.members.size > 0) ? message.mentions.members.first().user : message.author;
		let text = args.join(" ");

		const canvas = Canvas.createCanvas(700, 250);
		const ctx = canvas.getContext('2d');

		ctx.fillStyle = "#36393f";
		ctx.fillRect(0, 0, 1000, 250);

		// const avatarSize = 64;
		const avatarSize = 48;
		const padding = 16;
		
		const guildMember = message.guild.members.cache.find(u => u.id === user.id) ?? await message.guild.members.fetch(user.id);

		const textOffset = padding * 2 + avatarSize;
		Canvas.registerFont(fontFile('../whitneymedium.otf'), { family: 'Whitney', weight: 'medium' });
		Canvas.registerFont(fontFile('../whitneybook.otf'), { family: 'Whitney', weight: '400' });
		Canvas.registerFont(fontFile('../whitneysemibold.otf'), { family: 'Whitney', weight: 'semibold' });
		Canvas.registerFont(fontFile('../whitneybold.otf'), { family: 'Whitney', weight: 'bold' });
		Canvas.registerFont(fontFile('../whitneylight.otf'), { family: 'Whitney', weight: 'light' });

		// ctx.font = `medium 1.25rem "Whitney"`;
		ctx.textBaseline = "baseline";
		ctx.font = `medium 1rem "Whitney"`;
		ctx.fillStyle = guildMember.displayHexColor ?? "#ffffff";
		// ctx.fillText(guildMember.displayName, textOffset, padding * 2.25, 1000 - textOffset + padding);
		ctx.fillText(guildMember.displayName, textOffset, padding * 1.9, 1000 - textOffset + padding);
		
		const authorTextMetrics = ctx.measureText(guildMember.displayName);
		const timestampXOff = padding * 2.7 + avatarSize + authorTextMetrics.width;
		// ctx.font = `.8rem "Whitney"`;
		ctx.font = `400 .7rem "Whitney"`;
		ctx.fillStyle = "#72767d";
		const timestamp = `${message.createdAt.getUTCHours().toString().padStart(2, 0)}:${message.createdAt.getUTCMinutes().toString().padStart(2, 0)} ${(message.createdAt.getUTCHours() < 12) ? "AM" : "PM"}`;
		// ctx.fillText(`Today at  ${timestamp}`, timestampXOff, padding * 2.25, 1000 - timestampXOff + padding);
		ctx.fillText(`Today at  ${timestamp}`, timestampXOff, padding * 1.9, 1000 - timestampXOff + padding);
			
		ctx.font = `light 1rem "Whitney"`;
		ctx.textBaseline = "hanging";
		ctx.fillStyle = "#ffffff";
		// ctx.fillText(text, textOffset, padding * 2.8, 1000 - textOffset - padding);
		// console.log(1000 - textOffset * 4 - padding);

		// TODO add wrapping
		// await fillTextWithTwemoji(ctx, text, textOffset, padding * 2.25 + 12, { maxWidth: 1000 - textOffset * 4 - padding });
		await fillTextWithTwemoji(ctx, text, textOffset, padding * 1.67 + 12, { maxWidth: 1000 - textOffset * 4 - padding });

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