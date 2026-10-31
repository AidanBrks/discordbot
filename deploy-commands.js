const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
require('dotenv').config();

function normalizeSecret(value) {
  return (value || '').trim().replace(/^['"]|['"]$/g, '').replace(/^Bot\s+/i, '');
}

function isBotToken(value) {
  return /^[\w-]{20,}\.[\w-]{5,}\.[\w-]{20,}$/.test(value);
}

const token = normalizeSecret(process.env.DISCORD_TOKEN);
const clientId = normalizeSecret(process.env.CLIENT_ID);
const guildId = normalizeSecret(process.env.GUILD_ID);

if (!token || !clientId) {
  console.error('Missing DISCORD_TOKEN or CLIENT_ID. Copy .env.example to .env and fill both in.');
  process.exit(1);
}

if (!isBotToken(token)) {
  console.error('DISCORD_TOKEN is not a bot token. Discord rejects that with 401 Unauthorized.');
  console.error('Open the Developer Portal → your app → Bot → Reset Token, and paste that value.');
  console.error('Do not use the OAuth2 Client Secret. A bot token has three parts separated by dots.');
  process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if (!command.data) {
    console.warn(`[WARNING] Skipping ${file}: no slash command "data" to register.`);
    continue;
  }

  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    const route = guildId
      ? Routes.applicationGuildCommands(clientId, guildId)
      : Routes.applicationCommands(clientId);

    console.log(`Registering ${commands.length} slash command(s)${guildId ? ` to guild ${guildId}` : ' globally'}...`);

    const data = await rest.put(route, { body: commands });

    console.log(`Registered ${data.length} slash command(s).`);
  } catch (error) {
    if (error.status === 401) {
      console.error('Discord rejected DISCORD_TOKEN (401 Unauthorized).');
      console.error('Reset the token under Developer Portal → Bot → Reset Token, then update .env.');
    } else {
      console.error(error);
    }
    process.exitCode = 1;
  }
})();
