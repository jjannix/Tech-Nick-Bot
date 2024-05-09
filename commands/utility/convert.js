const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('convert')
        .setDescription('Convert milliseconds to a more human-readable format.')
        .addIntegerOption(option =>
            option.setName('milliseconds')
                .setDescription('The number of milliseconds to convert.')
                .setRequired(true)),
    async execute(interaction) {
        const milliseconds = interaction.options.getInteger('milliseconds');

        const duration = convertMilliseconds(milliseconds);

        const embed = new EmbedBuilder()
            .setColor('#7289da')
            .setTitle('Milliseconds Conversion')
            .setDescription(`Milliseconds: ${milliseconds}`)
            .addFields(
                { name: 'Duration', value: duration});

        await interaction.reply({ embeds: [embed] });
    },
};

function convertMilliseconds(milliseconds) {
    const timeUnits = [
        { label: 'day', milliseconds: 1000 * 60 * 60 * 24 },
        { label: 'hour', milliseconds: 1000 * 60 * 60 },
        { label: 'minute', milliseconds: 1000 * 60 },
        { label: 'second', milliseconds: 1000 },
        { label: 'millisecond', milliseconds: 1 }
    ];

    let duration = '';

    timeUnits.forEach(unit => {
        const unitValue = Math.floor(milliseconds / unit.milliseconds);
        milliseconds %= unit.milliseconds;
        if (unitValue > 0) {
            duration += `${unitValue} ${unit.label}${unitValue !== 1 ? 's' : ''}, `;
        }
    });

    return duration.replace(/,\s*$/, ''); 
}