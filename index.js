const fs = require('fs');
const path = require('path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

function normalizeSecret(value) {
  return (value || '').trim().replace(/^['"]|['"]$/g, '').replace(/^Bot\s+/i, '');
}

function isBotToken(value) {
  return /^[\w-]{20,}\.[\w-]{5,}\.[\w-]{20,}$/.test(value);
}

const prefix = process.env.PREFIX || '!';
const token = normalizeSecret(process.env.DISCORD_TOKEN);

if (!token) {
  console.error('Missing DISCORD_TOKEN. Copy .env.example to .env and set your bot token.');
  process.exit(1);
}

if (!isBotToken(token)) {
  console.error('DISCORD_TOKEN is not a bot token.');
  console.error('Open the Developer Portal → your app → Bot → Reset Token, and paste that value.');
  console.error('Do not use the OAuth2 Client Secret. A bot token has three parts separated by dots.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if (!command.name || typeof command.execute !== 'function') {
    console.warn(`[WARNING] Skipping ${file}: missing "name" or "execute".`);
    continue;
  }

  client.commands.set(command.name, command);
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  console.log(`Loaded ${client.commands.size} command(s). Prefix: ${prefix}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client, true);
  } catch (error) {
    console.error(error);
    const payload = { content: 'There was an error executing that command.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(payload);
    } else {
      await interaction.reply(payload);
    }
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();
  if (!commandName) return;

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, client, false);
  } catch (error) {
    console.error(error);
    await message.reply('There was an error executing that command.');
  }
});

client.login(token);
