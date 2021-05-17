const shopItems = require("../../modules/shopItems");
const guildJSON = require("../../modules/getJSON");
const products = require("./products");

module.exports = {
    name: "buy",
    description: "Buys an item from the shop based on its id or name.",
    aliases: [],
    category: "economy",
    debug: false,
    args: true,
    guildOnly: true,
    execute(message, args) {
        const givenItemName = args.join(" ").toLowerCase();
        console.log(givenItemName);
        const itemList = shopItems.list;

        console.log(itemList.map(item => item.name));
        const item = itemList.find(i => i.name.toLowerCase() === givenItemName || i.id === givenItemName);
        console.log(itemList);
        console.log(item);
        if (item != null || item != undefined) {
            const userBal = guildJSON.getBalance(message.guild.id, message.author.id);
            if (userBal == undefined)
                return message.reply("You do not have any balance. Please get some and try again.");
            
            if (userBal >= item.price) {
                const newBalance = guildJSON.setBalance(message.guild.id, message.author.id, userBal - item.price);
                let stats = guildJSON.getKey(message.guild.id, "stats");
                const user = stats.find(user => user.user == message.author.id);
                // no check required i think
                const userInv = user.inventory ?? {};

                //object.keys to get length of object, i think object.values could also work here
                if (Object.keys(userInv).length === 0) {
                    userInv[item.id] = 1;
                } else {
                    const itemAmt = userInv[Object.keys(userInv).find(key => key === item.id)] ?? 0;
                    if (item.canHaveMultiple) {
                        userInv[item.id] = itemAmt + 1;
                    } else {
                        // hurr durr "if bad switch good"
                        // ^ doesn't matter here
                        if (userInv[item.id] === 0) // idk how but maybe itll happen
                            userInv[item.id] = 1;
                        else if (userInv[item.id] === 1)
                            return message.channel.send(`${message.guild.member(message.author).displayName}, you can't have multiple of this item! Try again.`);
                        else
                            return message.channel.send("wtf? change server guild json lol");
                    }
                }

                user.inventory = userInv;
                message.reply(`Item \`${item.name}\` purchased for ${item.price} currency! You now have ${newBalance} currency. ${(!user.hasBoughtAShopItemBefore) ? "\n**Tip:** You can use \`m!use <item name>\` to use a product. Each product has different uses. Try them all!" : ""}`);
                user.hasBoughtAShopItemBefore = true;
                guildJSON.setKey(message.guild.id, "stats", stats);
            } else {
                return message.channel.send(`${message.guild.member(message.author).displayName}, you don't have enough currency to buy \`${item.name}\`! You currently have \`${userBal}\` currency.`);
            }
        } else {
            return message.channel.send(`${message.guild.member(message.author).displayName}, you inputted an invalid item! Check the shop and try again.`);
        }
    }
}