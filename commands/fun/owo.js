// Hahahahahaha
const UwUifier = require('uwuifier');
const uwuifier = new UwUifier({
    spaces: {
        faces: 0.05,
        actions: 0,
        stutters: 0.2
    },
    words: 1,
    exclamations: 1
});

// const owoify = require('owoify-js').default;

module.exports = {
    name: "owo",
    description: "Don't even.",
    args: true,
    aliases: [],
    debug: false,
    category: "fun",
    execute(message, args) {
        // return message.channel.send(owoify(args.join(" "), "uvu"));
        const toUwUify = args.join(" ");
        const characterLimit = 800;
        if (toUwUify.length >= characterLimit) {
            return message.channel.send(`You cannot have more than ${characterLimit} characters in the command parameters. Please try again.`);
        }
        return message.channel.send(uwuifier.uwuifySentence(args.join(" ")));
    }
}