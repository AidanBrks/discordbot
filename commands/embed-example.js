const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Sends an example rich embed card.'),
  name: 'embed',
  description: 'Sends an example rich embed card.',
  async execute(ctx, client) {
    const prefix = process.env.PREFIX || '!';

    const embed = new EmbedBuilder()
      .setColor(0xeb459e)
      .setTitle('Example card')
      .setDescription(
        'This is a rich embed built with `EmbedBuilder`. Copy this pattern into any command file to send a card.',
      )
      .addFields(
        { name: 'Slash', value: '`/embed`', inline: true },
        { name: 'Prefix', value: `\`${prefix}embed\``, inline: true },
        { name: 'What you can set', value: 'Color, title, description, fields, thumbnail, footer, and timestamp.' },
      )
      .setFooter({ text: client.user.username })
      .setTimestamp();

    await ctx.reply({ embeds: [embed] });
  },
};
