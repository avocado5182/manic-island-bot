module.exports = {
    name: "invite",
    category: "utility",
    description: "Sends an invite link for Manic Island",
    execute(message, args) {
        return message.channel.send("You can invite Manic Island to your server using this link: \nhttps://discord.com/oauth2/authorize?client_id=779785510314835988&scope=bot&permissions=872934487");
    }
}