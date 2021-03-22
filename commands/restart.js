const { ownerID, token } = require('../config.json');

module.exports = {
    name: "restart",
    description: "Restarts the bot. Only restartable by avocado",
    execute(message, args) {
        if (message.author.id == ownerID) {
            message.channel.send("Restarting...")
            .then(() => message.client.destroy())
            .then(() => message.client.login(token)
            .then(() => message.client.emit("ready"))
            .then(() => message.channel.send("Restarted!")));
        } else return;
    }
}