const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong and the bot latency.'),
  name: 'ping',
  description: 'Replies with Pong and the bot latency.',
  async execute(ctx, client) {
    await ctx.reply(`Pong! Websocket ping: ${client.ws.ping}ms.`);
  },
};
