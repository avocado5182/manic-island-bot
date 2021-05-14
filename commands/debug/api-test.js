const fetch = require('node-fetch');

module.exports = {
    name: 'api-test',
    description: 'Sends a GET request to the url specified and sends the response. Used for debug',
    aliases: ['api'],
    debug: true,
    category: "debug",
    usage: '<api endpoint url>',
    execute(message, args) {
        if (args.length == 0) return message.channel.send(`<@${message.author.id}> You need to provide a URL. Try again.`);

        fetch(args[0])
            .then(res => res.text())
            .then(body => message.channel.send(body, { code: "json" }))
            .catch(err => message.channel.send(err, { code: "xl" }));

        // axios.get(args[0])
        //     .then(res => {
        //         return message.channel.send(JSON.stringify(res), {code: "json"});
        //     })
        //     .catch(err => {
        //         return message.channel.send(err, { code: "xl" });
        //     });
    }
}