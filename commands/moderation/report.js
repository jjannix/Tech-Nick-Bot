const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report an issue or a user.')
        .addStringOption(option =>
            option.setName('report')
                .setDescription('Your report.')
                .setRequired(true)),
    async execute(interaction) {
        const report = interaction.options.getString('report');
        const channel = await interaction.guild.channels.cache.get(process.env.logChannelId); 

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('New Report')
            .setDescription(report)
            .setFooter({ text: `Reported by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        // Optionally send the report to a specific channel
        const reportChannel = channel
        if (reportChannel) {
            await reportChannel.send({ embeds: [embed] });
        }

        await interaction.reply({ content: 'Thank you for your report. Our team will review it shortly.', ephemeral: true });
    },
};