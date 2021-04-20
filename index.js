const fs = require('fs')
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
require('dotenv').config()

const commandfiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


for (const file of commandfiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        activity: { name: process.env.VER },
        status: 'online'
    })

});

client.on('message', message => {
	if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

	const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});


client.login(process.env.CLIENT_TOKEN);