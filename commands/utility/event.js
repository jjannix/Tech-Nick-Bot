const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');

const { thumbnailImage } = require('../../commandConfig.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event')
        .setDescription('Creates an Event, including RSVP Reactions')
        .addStringOption(option => option.setName('eventname').setDescription('The name of the event').setRequired(true))
        .addStringOption(option => option.setName('date').setDescription('The name of the event').setRequired(true)),

    async execute(interaction) {
        const eventName = interaction.options.getString('eventname');
        const date = interaction.options.getString('date');
        const eventEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(thumbnailImage)
            .setTitle(eventName)
            .setDescription(date)
            .setTimestamp()
            .setFooter({ text: 'jnk 2023' });
        const dateInMs = Date.parse(date);
        if (isNaN(dateInMs)) {
            await interaction.reply({ content: 'Please enter a valid date', ephemeral: true });
        } else if (eventName && date) {
            await interaction.reply({ embeds: [eventEmbed] });
            await interaction.followUp({ content: 'Event created!', ephemeral: true });
        }
    },
}