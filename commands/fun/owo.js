// Hahahahahaha
const UwUifier = require('uwuifier');
const owo = require("owofy");

module.exports = {
    name: "owo",
    description: "Don't even.",
    args: true,
    aliases: [],
    debug: false,
    category: "fun",
    execute(message, args) {
        const toUwUify = args.join(" ");
        const characterLimit = 800;
        if (toUwUify.length >= characterLimit) {
            return message.channel.send(`You cannot have more than ${characterLimit} characters in the command parameters. Please try again.`);
        }
        const uwuifier = new UwUifier({
            // spaces: {
            //     // faces: 0.2,
            //     actions: 0.2,
            //     // stutters: 0.2
            // },
            words: 1,
            exclamations: 1
        });


        // return message.channel.send(uwuifier.uwuifySentence(owo(toUwUify)));
        // console.log(owo.faces);
        // owo.faces.concat([
        //     "(・`ω´・)",
        //     ";w;",
        //     "OwO",
        //     "UwU",
        //     ">w<",
        //     "^w^",
        //     "ÚwÚ",
        //     "^-^",
        //     ":3",
        //     "x3",
        //     "＼(＾▽＾)／",
        //     "TwT",
        //     "-w-"
        // ]);
        // console.log(owo.faces);

        return message.channel.send(owo(toUwUify));
    }
}