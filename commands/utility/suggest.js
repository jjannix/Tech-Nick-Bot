const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Suggest an idea or feature.')
        .addStringOption(option =>
            option.setName('suggestion')
                .setDescription('Your suggestion.')
                .setRequired(true)),
    async execute(interaction) {
        const suggestion = interaction.options.getString('suggestion');
        const channel = await interaction.guild.channels.cache.get(process.env.logChannelId); 

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('New Suggestion')
            .setDescription(suggestion)
            .setFooter({ text: `Suggested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        // Optionally send the suggestion to a specific channel
        const suggestionChannel = channel
        if (suggestionChannel) {
            await suggestionChannel.send({ embeds: [embed] });
        }

        await interaction.reply({ content: 'Thank you for your suggestion!', ephemeral: true });
    },
};