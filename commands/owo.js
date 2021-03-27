// Hahahahahaha
const owoify = require('owoify-js').default;

module.exports = {
    name: "owo",
    description: "Don't even.",
    args: true,
    aliases: [],
    debug: false,
    category: "fun",
    execute(message, args) {
        return message.channel.send(owoify(args.join(" "), "uvu"));
    }
}