const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { thumbnailImage } = require('../../commandConfig.json')
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event')
        .setDescription('Creates an Event, including RSVP Reactions')
        .addStringOption(option => option.setName('eventname').setDescription('The name of the event').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Description of the event').setRequired(true))
        .addStringOption(option => option.setName('date').setDescription('Date of the event').setRequired(true))
        .addIntegerOption(option => option.setName('helfer').setDescription('Numbers of helpers needed.').setRequired(false)),

    async execute(interaction) {
        const eventName = interaction.options.getString('eventname');
        const date = interaction.options.getString('date');
        const description = interaction.options.getString('description');
        const helfer = interaction.options.getInteger('helfer');
        const helferValue = helfer ? helfer.toString() : 'Keine Angabe';
        const eventEmbed = new EmbedBuilder()
            .setColor('#FDCE0F')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(thumbnailImage)
            .setTitle(eventName)
            .addFields(
                { name: '**Datum**', value: date },
                { name: '**Eventbeschreibung**', value: description },
                { name: '**Benötigte Helfer**', value: helferValue },)
            .setTimestamp()
            .setFooter({ text: '© @jnk 2023' });
        const dateInMs = moment(date, "DD.MM.YYYY").valueOf();
        if (isNaN(dateInMs)) {
            await interaction.reply({ content: 'Please enter a valid date', ephemeral: true });
        } else if (eventName && date) {
            await interaction.deferReply();
            await wait(2000);
            const message = await interaction.editReply({ embeds: [eventEmbed], fetchReply: true });
            await interaction.followUp({ content: 'Event created!', ephemeral: true });
            message.react('✅');
            message.react('❓');
            message.react('❌');
        }
    },
}
