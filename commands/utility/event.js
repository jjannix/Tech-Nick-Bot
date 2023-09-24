const { SlashCommandBuilder } = require ('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event')
        .setDescription('Creates an Event, including RSVP Reactions')
        .addStringOption(option => option.setName('date').setDescription('The name of the event').setRequired(true))
        .addStringOption(option => option.setName('eventname').setDescription('The name of the event').setRequired(true)),
        async execute(interaction) {
            const eventName = interaction.options.getString('eventname');
            const date = interaction.options.getString('date');
            if (eventName && date) return interaction.reply(`Event created: ${eventName}, starting at ${date}`);
		    return interaction.reply('No event name provided.');
        },
}
