// const { ownerID } = require('../config.json');
const index = require('../index.js');
require("dotenv").config();

const clean = text => {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }  

module.exports = {
    name: 'eval',
    aliases: ['evaluate','run'],
    description: 'Evaluates any line of JavaScript code as if you were the bot. Extremely dangerous.',
    debug: true,
    category: "debug",
    args: true,
	execute(message, args) {
        if(message.author.id !== process.env["OWNER_ID"]) return message.channel.send("Lol");
        try {
            const code = args.join(" ");
            let evaled = eval(code);
       
            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);
                
            message.channel.send(clean(evaled), {code:"js"});
          } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
            console.trace(clean(err));
          }      
	},
};