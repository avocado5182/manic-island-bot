const shopItems = require("../../modules/shopItems");
const guildJSON = require("../../modules/getJSON");
const products = require("./products");

module.exports = {
    name: "use",
    description: "Uses a shop item based on its id or name.",
    aliases: [],
    category: "economy",
    debug: false,
    guildOnly: true,
    execute(message, args) {
        // https://stackoverflow.com/a/45801141
        let givenItemName = args.join(" ");
        let amt = 1;
        if (args.length > 1) {
            givenItemName = args.slice(0,-1).join(" ");
            const amount = (+args[args.length - 1]);

            if (amount !== NaN)
                amt = amount;
        }
        console.log(givenItemName, amt);

        const itemList = shopItems.list;

        const item = itemList.find(item => item.name === givenItemName || item.id === givenItemName);

        let stats = guildJSON.getKey(message.guild.id, "stats");
        let user = stats.find(u => u.user === message.author.id);
        console.log(amt);
        if (user.inventory == null || user.inventory == undefined || user.inventory.length === 0) {
            return message.channel.send(`${message.author.username}, you have 0 \`${item.name}\`s! Please try again.`);
        } else {
            const itemKey = Object.keys(user.inventory).find(i => i === item.id);
            console.log(user.inventory[itemKey]);
            if (user.inventory[itemKey] >= amt) {
                if (item.canUseMultiple) {
                    try {
                        item.use(message, amt);
                        user.inventory[itemKey] -= amt;
                    } catch (err) {
                        // // idk how to do proper errors so
                        if (err.message.toLowerCase().includes("exited from command")) {
                            return message.channel.send("exited from using item `" + item.name + "`");
                        }
                    }
                } else {
                    if (amt > 1) {
                        // can't use multiple and amt is mutlple
                        return message.channel.send(`${message.guild.member(message.author).displayName}, you can only use one of this item at a time!`);
                    }
                }
                stats = guildJSON.setKey(message.guild.id, "stats", stats);
            } else {
                return message.channel.send(`${message.guild.member(message.author).displayName}, you don't have enough \`${item.name}\`s, please try again!`);
            }
        }
    }
}