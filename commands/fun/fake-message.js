const path = require('path');

const Canvas = require("canvas");
const {
	fillTextWithTwemoji
} = require('node-canvas-with-twemoji-and-discord-emoji');

const {
	MessageAttachment
} = require("discord.js");

function fontFile(name) {
	return path.join(__dirname, "../", name);
}


// Taken from Dank Memer's imgen API, specifically
// https://github.com/DankMemer/imgen/blob/master/utils/textutils.py
function wrap(font, text, lineWidth) {
	const words = text.split(" ");
	let lines = [];
	let line = [];
	// "flame is a catboy" < example text
	// ["flame", "is", "a", "catboy"] < words array

	// the loop below adds words to a line then appends that line
	// to lines when the current line width > lineWidth
	for (const word of words) {
		let newline = word;
		console.log("Line at start:" + line);
		if (line.length > 0)
			newline = [line, [word]].join(" "); 

		// w, h = font.getsize(newline)
		// h isn't used and Canvas's text metrics has width, so we can use that alone
		const canvas = Canvas.createCanvas(700, 250);
		const ctx = canvas.getContext('2d');

		ctx.font = font;
		const textMetrics = ctx.measureText(newline);
		const w = textMetrics.width;

		if (w > lineWidth) {
			console.log("Line before: " + line);
			lines.push(line.join(" "));
			line = [word];
			console.log("Line after: " + line);
		} else {
			line.push(word);
		}
	}

	if (line.length > 0) {
		console.log(line);
		lines.push(line.join(" "));
	}
	return lines.join("\n").trim();
}

function numberToLetter(number, uppercase = true) {
	// 65-90 or 97-122 inclusive
	return String.fromCharCode(((number % 26) + 1) + ((uppercase) ? 64 : 96));
}

// lmao https://www.techiedelight.com/replace-character-specified-index-javascript/
String.prototype.replaceAt = function (index, replacement) {
	if (index >= this.length)
		return this.valueOf();
		
	return this.substring(0, index) + replacement + this.substring(index + 1);
}

module.exports = {
	name: "fake-message",
	description: "Fakes a discord message",
	aliases: ["fake-msg", "fakemessage", "fakemsg"],
	debug: false,
	args: true,
	category: "fun",
	usage: "<user (optional)> <text>",
	async execute(message, args) {
		// https://discordjs.guide/popular-topics/canvas.html

		let user = (message.mentions.members.size > 0) ? message.mentions.members.first().user : message.author;
		let text = args.join(" ").trim().replace(/(<[@!:]+\d{8,}>)+/g, "");

		const avatarSize = 48;
		// const avatarSize = 64;
		const padding = 16;

		const guildMember = message.guild.members.cache.find(u => u.id === user.id) ?? await message.guild.members.fetch(user.id);

		const textOffset = padding * 2 + avatarSize;
		Canvas.registerFont(fontFile('../whitneymedium.otf'), {
			family: 'Whitney',
			weight: 'medium'
		});
		Canvas.registerFont(fontFile('../whitneybook.otf'), {
			family: 'Whitney',
			weight: '400'
		});
		Canvas.registerFont(fontFile('../whitneysemibold.otf'), {
			family: 'Whitney',
			weight: 'semibold'
		});
		Canvas.registerFont(fontFile('../whitneybold.otf'), {
			family: 'Whitney',
			weight: 'bold'
		});
		Canvas.registerFont(fontFile('../whitneylight.otf'), {
			family: 'Whitney',
			weight: 'light'
		});

		const canvas = Canvas.createCanvas(700, 250);
		const ctx = canvas.getContext('2d');

		ctx.fillStyle = "#36393f";
		ctx.fillRect(0, 0, 700, 250);

		// ctx.font = `medium 1.25rem "Whitney"`;
		ctx.textBaseline = "baseline";
		ctx.font = `medium 1rem "Whitney"`;
		ctx.fillStyle = (guildMember.displayHexColor === "#000000") ? "#ffffff" : guildMember.displayHexColor;
		// ctx.fillText(guildMember.displayName, textOffset, padding * 2.25, 700 - textOffset + padding);
		ctx.fillText(guildMember.displayName, textOffset, padding * 1.9, 700 - textOffset + padding);

		const authorTextMetrics = ctx.measureText(guildMember.displayName);
		const timestampXOff = padding * 2.7 + avatarSize + authorTextMetrics.width;
		// ctx.font = `.8rem "Whitney"`;
		ctx.font = `400 .7rem "Whitney"`;
		ctx.fillStyle = "#72767d";
		const timestamp = `${message.createdAt.getUTCHours().toString().padStart(2, 0)}:${message.createdAt.getUTCMinutes().toString().padStart(2, 0)} ${(message.createdAt.getUTCHours() < 12) ? "AM" : "PM"}`;
		// ctx.fillText(`Today at  ${timestamp}`, timestampXOff, padding * 2.25, 700 - timestampXOff + padding);
		ctx.fillText(`Today at  ${timestamp}`, timestampXOff, padding * 1.9, 700 - timestampXOff + padding);

		ctx.font = `light 1rem "Whitney"`;
		ctx.textBaseline = "hanging";
		ctx.fillStyle = "#ffffff";

		// regex below matches emojis
		const emojis = text.match(/(<[a]?:[A-Za-z0-9_-]+:\d{8,}>)+/g);

		let adjusted = text;
		if (emojis !== null && emojis.length > 0) {
			for (let i = 0; i < emojis.length; i++) {
				emojis[i] = [emojis[i], adjusted.indexOf(emojis[i])];
				const words = adjusted.split(" ");
				words[words.findIndex(w => w === emojis[i][0])] = numberToLetter(i);
				adjusted = words.join(" ");
			}
		}

		const wrapped = wrap(ctx.font, adjusted, 700 - (padding * 3 + avatarSize));
		let finalText = wrapped;
		const wrappedArr = wrapped.split("");
		let emojiIndex = 0;
		for (let i = 0; i < wrappedArr.length; i++) {
			if (wrappedArr[i].includes(numberToLetter(emojiIndex)) && !!emojis) {
				const currEmoji = emojis[emojiIndex];
				if (currEmoji[1] === i) 
					finalText = finalText.replaceAt(i, currEmoji[0]);
				
				emojiIndex++;
			}
		}

		await fillTextWithTwemoji(ctx, finalText, textOffset, padding * 1.67 + 12, {
			maxWidth: 700 - textOffset * 4 - padding
		});

		// Pick up the pen
		ctx.beginPath();
		// Start the arc to form a circle
		ctx.arc(padding + (avatarSize / 2), padding + (avatarSize / 2), avatarSize / 2, 0, Math.PI * 2, true);
		// Put the pen down
		ctx.closePath();
		// Clip off the region you drew on
		ctx.clip();

		const avatar = await Canvas.loadImage(user.displayAvatarURL({
			format: 'png'
		}));
		ctx.drawImage(avatar, padding, padding, avatarSize, avatarSize);

		const attachment = new MessageAttachment(canvas.toBuffer(), `message-${message.id}.png`);

		message.channel.send(attachment);
	}
}