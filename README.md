# discordbot

Modular Discord bot built with Discord.js v14. Every `.js` file in `commands/` is loaded on startup and works as both a slash command and a prefix command (`!` by default).

Requires Node.js 18 or newer.

## Discord Developer Portal

1. Open the [Discord Developer Portal](https://discord.com/developers/applications) and create an application.
2. Open **Bot**, click **Reset Token**, and copy the token. This is `DISCORD_TOKEN`.
3. On the same **Bot** page, turn on **Message Content Intent**. Prefix commands in servers need it.
4. Open **OAuth2** and copy the **Application ID**. This is `CLIENT_ID`.
5. Use the **OAuth2 URL Generator** to invite the bot:
   - Scopes: `bot`, `applications.commands`
   - Bot permissions: Send Messages, Embed Links, Use Slash Commands
6. Optional: copy a server ID into `GUILD_ID` so slash commands show up immediately in that server. Leave it blank to register commands globally.

## Setup

```bash
npm install
```

Copy the example env file and fill in your token and application id:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `DISCORD_TOKEN` | Yes | Bot token |
| `CLIENT_ID` | Yes for deploy | Application id |
| `GUILD_ID` | No | Register slash commands to one server |
| `PREFIX` | No | Prefix for text commands. Defaults to `!` |

## Run

Register slash commands, then start the bot:

```bash
npm run deploy
npm start
```

`npm run deploy` reads `commands/` and registers each file that exports `data`. With `GUILD_ID` set, registration is limited to that server and updates right away. Without it, commands are global and can take up to an hour to appear.

Prefix commands are available as soon as the bot is online. They do not need a deploy step.

## Add a command

Drop a new file in `commands/`. The loader picks up any `.js` file that exports `name` and `execute`.

```js
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Says hello.'),
  name: 'hello',
  description: 'Says hello.',
  async execute(ctx, client, isSlash) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('Hello')
      .setDescription('Sent from a command file.');

    await ctx.reply({ embeds: [embed] });
  },
};
```

`ctx` is the slash interaction when `isSlash` is `true`, and the message when it is `false`. Both accept `ctx.reply({ content, embeds })`.

Restart the bot so the prefix command loads. Run `npm run deploy` again so the slash command is registered.

## Included commands

| Command | What it does |
| --- | --- |
| `/ping`, `!ping` | Replies with Pong and websocket latency |
| `/help`, `!help` | Lists every loaded command as slash and prefix |
| `/info`, `!info` | Bot tag, server count, uptime, library versions |
| `/embed`, `!embed` | Example rich embed card |
| `/uptime`, `!uptime` | How long the process has been online |
