module.exports = {
    name: "flame",
    description: "Flame is a catboy",
    aliases: [],
    debug: false,
    category: "fun",
    execute(message, args) {
        const chance = 10;
        const isFlameACatboy = (Math.floor(Math.random() * chance) !== chance - 1); // chance - 1 / chance to be a catboy
        return message.channel.send((isFlameACatboy) ? "Flame is a catboy" : "Flame is not a catboy");
    }
}