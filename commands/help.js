const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Lists available slash and prefix commands.'),
  name: 'help',
  description: 'Lists available slash and prefix commands.',
  async execute(ctx, client) {
    const prefix = process.env.PREFIX || '!';
    const lines = [...client.commands.values()].map(
      (command) => `\`/${command.name}\` · \`${prefix}${command.name}\` — ${command.description}`,
    );

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('Commands')
      .setDescription(lines.join('\n') || 'No commands loaded.')
      .setFooter({ text: `Prefix: ${prefix}` })
      .setTimestamp();

    await ctx.reply({ embeds: [embed] });
  },
};
