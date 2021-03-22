const fs = require('fs');

function prompt(message, questions, filters, checkQuestions, checkAfter = true, currQ = 0, answers = []) {
    // message: Discord.Message
    // questions: string[]
    // filters: Discord.CollectorFilter[]
    // checkQuestions: string[]
    // checkAfter: boolean
    // currQ: int
    // answers: string[]
    if (!checkAfter) checkQuestions = [];

    message.channel.send(questions[currQ]).then(() => {
        const messageFilter = m => filters[currQ](m) && (message.author.id === m.author.id);
        message.channel.awaitMessages(messageFilter, {
            max: 1,
            time: 60000,
            errors: ['time']
        })
        .then(collected => {
            if (checkAfter) {
                let questionToSend = checkQuestions[currQ].replace("%content%", `${collected.first().content}`);
                message.channel.send(questionToSend).then(msg => {
                    msg.react("✅").then(() => msg.react("❌")).then(() => {
                        const reactionFilter = (reaction, user) => (reaction.emoji.name === "✅" || reaction.emoji.name === "❌") && user.id === message.author.id;
                        msg.awaitReactions(reactionFilter, {
                            max: 1,
                            time: 30000,
                            errors: ['time']
                        })
                        .then(reacted => {
                            // User reacted
                            if (reacted.get("✅")) {
                                if (currQ < questions.length - 1) {
                                    // Continue by prompting the next question
                                    currQ++;
                                    answers.push(collected.first().content);
                                    prompt(message, questions, filters, checkQuestions, true, currQ, [...answers]);
                                } else {
                                    // Finally, create the product
                                    answers.push(collected.first().content);
                                    
                                    let serverJSONPath = `./db/economy/${message.guild.id}.json`;
                                    let serverJSONObj;
                                    
                                    let itemObj = {
                                        name: answers[0],
                                        description: answers[1],
                                        price: answers[2],
                                        sellerID: message.author.id,
                                        productID: 0
                                    };

                                    if (fs.existsSync(serverJSONPath)) {
                                        serverJSONObj = JSON.parse(fs.readFileSync(serverJSONPath));
                                        serverJSONObj.products.push(itemObj);
                                    } else {
                                        serverJSONObj = {
                                            products: [
                                                itemObj
                                            ]
                                        };
                                    }

                                    fs.writeFileSync(serverJSONPath, JSON.stringify(serverJSONObj));

                                    return message.channel.send("Product created!");
                                }
                            } else if (reacted.get("❌")) {
                                // Reprompt the user
                                prompt(message, questions, filters, checkQuestions, true, currQ, answers);
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            return message.reply("you did not react in time or something went wrong. Please try again.");
                        });
                    });
                });
            } else {
                // User inputted stuff
                if (currQ < questions.length - 1) {
                    // Continue by prompting the next question
                    currQ++;
                    prompt(message, questions, filters, [], false, currQ, [...answers, collected.first().content]);
                } else {
                    // Finally, create the product
                    // No need to validate the answers, the filters did that
                    answers.push(collected.first().content);
                    let serverJSONPath = `./db/economy/${message.guild.id}.json`;
                    let serverJSONObj;
                    
                    let itemObj = {
                        name: answers[0],
                        description: answers[1],
                        price: answers[2]
                    };
                    
                    if (fs.existsSync(serverJSONPath)) {
                        serverJSONObj = JSON.parse(fs.readFileSync(serverJSONPath));
                        
                        
                        serverJSONObj.products.push({
                            ...itemObj,
                            sellerID: message.author.id,
                            productID: serverJSONObj.products.length
                        });
                    } else {
                        serverJSONObj = {
                            products: [{
                                ...itemObj,
                                sellerID: message.author.id,
                                productID: 0
                            }]
                        };
                    }

                    fs.writeFileSync(serverJSONPath, JSON.stringify(serverJSONObj));

                    return message.channel.send("Product created!");
                }
            }
        })
        .catch(err => {
            console.error(err);
            return message.reply("you did not answer in time or something else went wrong. Please try again.");
        });
    });
}

module.exports = {
    name: "createproduct",
    description: "Creates a product with an interactive setup",
    usage: "",
    execute(message, args) {
        // Skipping role/perm check for now
        const strfilter = msg => (typeof msg.content === "string");
        const numfilter = msg => (msg - 0) == msg && ('' + msg).trim().length > 0;

        prompt(
            message,
            [
                "What would you like to name your product?",
                "What description would you like to give to your product?",
                "How much would you like your product to cost?"
            ],
            [
                strfilter,
                strfilter,
                numfilter
            ],
            [
                "Are you sure you would like to call your product \"%content%\"?",
                "Are you sure you would like to give your product a description of \"%content%\"?",
                "Are you sure you would like your product to cost %content%?"
            ],
            true
        );
    }
}