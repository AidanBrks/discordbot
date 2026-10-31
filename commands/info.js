const { EmbedBuilder, SlashCommandBuilder, version } = require('discord.js');

function formatUptime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    days ? `${days}d` : null,
    hours ? `${hours}h` : null,
    minutes ? `${minutes}m` : null,
    `${seconds}s`,
  ]
    .filter(Boolean)
    .join(' ');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Shows information about the bot.'),
  name: 'info',
  description: 'Shows information about the bot.',
  async execute(ctx, client) {
    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle(client.user.tag)
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: 'Servers', value: String(client.guilds.cache.size), inline: true },
        { name: 'Uptime', value: formatUptime(client.uptime ?? 0), inline: true },
        { name: 'discord.js', value: `v${version}`, inline: true },
        { name: 'Node.js', value: process.version, inline: true },
      )
      .setTimestamp();

    await ctx.reply({ embeds: [embed] });
  },
};
