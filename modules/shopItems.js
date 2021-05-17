const guildJSON = require("./getJSON");

module.exports = {
    // idToName(id) {
    //     const item = this.list.find(i => i.id === id);
    //     return (item === undefined) ? undefined : item.name;
    // },
    // nameToId(name) {
    //     const item = this.list.find(i => i.name === name);
    //     return (item === undefined) ? undefined : item.id;
    // },
    list: [
        {
            name: "Dice",
            description: "A 6-sided die",
            id: "dice",
            price: 20,
            canHaveMultiple: true,
            canUseMultiple: true,
            async use(message, amt=1) {
                for (let i = 0; i < amt; i++) {
                    const rolled1 = Math.floor(Math.random() * 6) + 1;
                    message.channel.send(`**Roll ${i + 1}:** ${rolled1}`);
                }
            }
        },
        {
            name: "Cat",
            description: "Cat from Battle Cats",
            id: "cat",
            price: 75,
            canHaveMultiple: true,
            canUseMultiple: false,
            async use(message, amt=1) {
                
            }
        },
        {
            name: "Fire",
            description: "Not a reference to a certain flame..",
            id: "fire",
            price: 100,
            canHaveMultiple: true,
            canUseMultiple: true,
            async use(message, amt=1) {
                const user = message.author;
                // put the user on fire >:D
                if (user.id === "708748287909298318")
                    return message.channel.send("We do a little trolling.");
                else {
                    const msgs = [
                        `You've been on fire for ${(amt === 1) ? "a" : amt} minute${(amt !== 1) ? "s" : ""}! What did you do??`,
                        "What is the meaning of fire?",
                        "**Early humans be like**: haha fire go brr"
                    ];
                    const index = Math.floor(Math.random() * msgs.length);
                    return message.channel.send(msgs[index]);
                }
            }
        },
        {
            name: "The Unpingable Robot",
            description: "Use this item to mostly prevent others from doing negative things to you. It works 75% of the time. If you attempt to do something negative to someone else while holding this item, this item has a 25% chance to stop you. If someone successfully does a negative thing, you lose 1 of this item.",
            id: "unpinga",
            price: 120000,
            canHaveMultiple: true,
            canUseMultiple: false,
            async use(message, amt=1) {
                return message.channel.send("in progress");
            }
        },
        {
            name: "Omega Mart Lemon",
            description: "Definitely 100% real lemon",
            id: "omlemons",
            price: 1000,
            canHaveMultiple: true,
            canUseMultiple: true,
            async use(message, amt=1) {
                for (let i = 0; i < amt; i++) {
                    message.channel.send(`${message.guild.member(message.author).displayName}, ${(amt <= 1) ? "the lemon is edible" : "these lemons are edible"}. Do you want to eat ${(amt <= 1) ? "it" : "them" }?\n\n*You have 30 seconds to answer.*`)
                    .then(msg => {
                        msg.react("✅").then(() => msg.react("❌"))
                        .then(() => {
                            const reactionFilter = (reaction, user) => (reaction.emoji.name === "✅" || reaction.emoji.name === "❌") && user.id === message.author.id;
                            msg.awaitReactions(reactionFilter, {
                                max: 1,
                                time: 30000,
                                errors: ['time']
                            })
                            .then(reacted => {
                                // User reacted
                                if (reacted.get("✅")) {
                                    return message.channel.send("ok, the eating is in progress tho");
                                } else if (reacted.get("❌")) {
                                    message.channel.send("Aww, okay. The lemons are pretty nice though. 100% real and fresh :)");
                                    throw Error(`Exited from command ${this.name}`);
                                }
                            }).catch(err => {
                                console.error(err);
                                message.channel.send(`${message.guild.member(message.author).displayName}, you did not reply in time or something else went wrong. Please try again`);
                                throw Error(`Exited from command ${this.name}`);
                            });
                        });
                    })
                    .catch(err => {
                        console.error(err);
                    })
                }
            }
        },
        {
            name: "avocado",
            description: "it's just <@543817742487388179>!",
            id: "avo",
            price: 100,
            canHaveMultiple: true,
            canUseMultiple: true,
            async use(message, amt=1) {
                const user = message.author;
                // put the user on fire >:D
                if (user.id === "543817742487388179") {
                    return message.channel.send("We do a little trolling.");
                } else {
                    for (let i = 0; i < amt; i++) {
                        message.channel.send("haha avocado go brr :avocado: :bread:");
                    }
                }
            }
        }
    ]
}