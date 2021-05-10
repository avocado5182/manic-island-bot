const fs = require('fs');

function prompt(message, productName, questions, filters, checkQuestions, checkAfter = true, currQ = 0, answers = [], skips = []) {
    // message: Discord.Message
    // productName string
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
                if (collected.first().content.toLowerCase() === "skip") {
                    if (currQ < questions.length - 1) {
                        // Continue by prompting the next question
                        let serverJSONPath = `./db/economy/${message.guild.id}.json`;
                        let serverJSONObj = {};

                        if (fs.existsSync(serverJSONPath)) {
                            serverJSONObj = JSON.parse(fs.readFileSync(serverJSONPath));
                            let product = serverJSONObj.products.find(p => p.name === productName);
                            answers.push(Object.values(product)[currQ]);
                            
                            currQ++;
                            prompt(message, productName, questions, filters, checkQuestions, checkAfter, currQ, [...answers]);
                        }
                    } else {
                        // Finally, create the product
                        let serverJSONPath = `./db/economy/${message.guild.id}.json`;
                        let serverJSONObj = {};
                        
                        if (fs.existsSync(serverJSONPath)) {
                            serverJSONObj = JSON.parse(fs.readFileSync(serverJSONPath));
                            let product = serverJSONObj.products.find(p => p.name === productName);
                            answers.push(product.price);

                            let itemObj = {
                                name: answers[0],
                                description: answers[1], 
                                price: answers[2]
                            };

                            itemObj.sellerID = product.sellerID;
                            itemObj.productID = product.productID;
                            
                            product = itemObj;

                            // product.name = answers[0];
                            // product.description = answers[1];
                            // product.price = answers[2];
                            
                            const productIndex = serverJSONObj.products.findIndex(p => p.name === productName);
                            serverJSONObj.products[productIndex] = product;

                            fs.writeFileSync(serverJSONPath, JSON.stringify(serverJSONObj));

                            fs.writeFileSync(serverJSONPath, JSON.stringify(serverJSONObj));
                            return message.channel.send("Product modified!");
                        }
                    }
                } else if (collected.first().content.toLowerCase() === "stop") {
                    return message.channel.send("Product modification stopped.");
                } else if (checkAfter) {
                    let questionToSend = checkQuestions[currQ].replace("%content%", `${collected.first().content}`);
                    message.channel.send(questionToSend).then(msg => {
                        msg.react("✅").then(() => msg.react("❌")).then(() => {
                            const reactionFilter = (reaction, user) => (reaction.emoji.name === "✅" || reaction.emoji.name === "❌") && user.id === message.author.id;
                            msg.awaitReactions(reactionFilter, {
                                max: 1,
                                time: 30000,
                                errors: ['time']
                            }).then(reacted => {
                                // User reacted
                                if (reacted.get("✅")) {
                                    if (currQ < questions.length - 1) {
                                        // Continue by prompting the next question
                                        currQ++;
                                        answers.push(collected.first().content);
                                        prompt(message, productName, questions, filters, checkQuestions, checkAfter, currQ, [...answers]);
                                    } else {
                                        // // Finally, create the product
                                        let serverJSONPath = `./db/economy/${message.guild.id}.json`;
                                        let serverJSONObj = {};

                                        answers.push(collected.first().content);
                                        
                                        if (fs.existsSync(serverJSONPath)) {
                                            serverJSONObj = JSON.parse(fs.readFileSync(serverJSONPath));
                                            let product = serverJSONObj.products.find(p => p.name === productName);

                                            let itemObj = {
                                                name: answers[0],
                                                description: answers[1], 
                                                price: answers[2]
                                            };

                                            product = itemObj;
                
                                            // product.name = answers[0];
                                            // product.description = answers[1];
                                            // product.price = answers[2];
                                            
                                            const productIndex = serverJSONObj.products.findIndex(p => p.name === productName);
                                            serverJSONObj.products[productIndex] = product;

                                            fs.writeFileSync(serverJSONPath, JSON.stringify(serverJSONObj));

                                            return message.channel.send("Product modified!");
                                        }
                                    }
                                } else if (reacted.get("❌")) {
                                    // Reprompt the user
                                    prompt(message, productName, questions, filters, checkQuestions, checkAfter, currQ, answers);
                                }
                            }).catch(err => {
                                console.error(err);
                                return message.reply("you did not reply in time or something else went wrong. Please try again");
                            });
                        });
                    });
                } else {
                    // User inputted stuff
                    if (currQ < questions.length - 1) {
                        // Continue by prompting the next question
                        answers.push(collected.first().content);
                        
                        currQ++;
                        prompt(message, productName, questions, filters, [], checkAfter, currQ, [...answers]);
                    } else {
                        // Finally, create the product
                        // No need to validate the answers, the filters did that
                        let serverJSONPath = `./db/economy/${message.guild.id}.json`;
                        let serverJSONObj;
                        
                        answers.push(collected.first().content);
                        if (fs.existsSync(serverJSONPath)) {
                            serverJSONObj = JSON.parse(fs.readFileSync(serverJSONPath));
                            let product = serverJSONObj.products.find(p => p.name === productName);

                            let itemObj = {
                                name: answers[0],
                                description: answers[1],
                                price: answers[2]
                            };

                            itemObj.sellerID = product.sellerID;
                            itemObj.productID = product.productID;

                            product = itemObj;

                            // product.name = answers[0];
                            // product.description = answers[1];
                            // product.price = answers[2];
                            
                            const productIndex = serverJSONObj.products.findIndex(p => p.name === productName);
                            serverJSONObj.products[productIndex] = product;
                        }

                        fs.writeFileSync(serverJSONPath, JSON.stringify(serverJSONObj));

                        return message.channel.send("Product modified!");
                    }
                }
            })
            .catch(err => {
                console.error(err);
                return message.reply("you did not answer in time or something else went wrong. Please try again.");
            });
    });
    // catch probably unneeded
}

module.exports = {
    name: "editproduct",
    description: "Edits a product",
    args: true,
    aliases: ["edit"],
    category: "economy",
    usage: "<product name>",
    execute(message, args) {
        let serverJSONPath = `./db/economy/${message.guild.id}.json`;

        if (fs.existsSync(serverJSONPath)) {
            let serverJSONFile = fs.readFileSync(serverJSONPath);
            let productList = JSON.parse(serverJSONFile).products;
            let givenName = args.join(" ");

            let product = productList.find(p => p.name === givenName);
            if (product) {
                if (product.sellerID === message.author.id) {
                    // Start guided setup
                    const strfilter = msg => (typeof msg.content === "string");
                    const numfilter = msg => (msg - 0) == msg && ('' + msg).trim().length > 0;

                    questions = [
                        "What would you like to change the name of the product to? (Say `skip` to skip)",
                        "What would you like to change the description of the product to? (Say `skip` to skip)",
                        "What would you like to change the price of the product to? (Say `skip` to skip)"
                    ];

                    checkAfterQuestions = [
                        "Are you sure you want to change your product name to \"%content%\"?",
                        "Are you sure you want to change your product description to \"%content%\"?",
                        "Are you sure you want to change your product price to %content%?"
                    ];

                    filters = [
                        strfilter,
                        strfilter,
                        numfilter
                    ];

                    prompt(message, givenName, questions, filters, checkAfterQuestions, false);
                } else {
                    return message.reply("You can't edit that product because you are not the seller of it. \nYou can ask the seller if you would like for the product to be changed.");
                }
            } else {
                return message.reply("The given product doesn't exist. Please try again.");
            }
        } else {
            return message.reply("There are no products to edit. Please create a product and try again.");
        }
    }
}