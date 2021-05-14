module.exports = {
    name: 'ping',
    description: 'Gets Manic Island\'s ping',
    category: "debug",
    execute(message, args) {
        // https://stackoverflow.com/questions/63411268/discord-js-ping-command
        // message.channel.send('Loading data').then(async (msg) => {
        //     msg.delete()
        //     message.channel.send(`🏓Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
        // })

        message.channel.send("Pinging...")
        .then(async (msg) => {
            msg.delete();
            return message.channel.send(`🏓 Pong! (${msg.createdTimestamp - message.createdTimestamp}ms)`);
        });
    }
}