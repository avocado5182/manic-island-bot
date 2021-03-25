// const { ownerID, token } = require('../config.json');
require("dotenv").config();

module.exports = {
    name: "restart",
    category: "debug",
    description: "Restarts the bot. Only restartable by avocado",
    execute(message, args) {
        if (message.author.id == process.env.OWNER_ID) {
            message.channel.send("Restarting...")
            .then(() => message.client.destroy())
            .then(() => message.client.login(process.env.TOKEN)
            .then(() => message.client.emit("ready"))
            .then(() => message.channel.send("Restarted!")));
        } else return;
    }
}