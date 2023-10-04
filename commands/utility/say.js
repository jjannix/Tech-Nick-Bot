const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Repeats the input')
        .addStringOption(option => option.setName('message').setDescription('The message to repeat').setRequired(true)),

    async execute(interaction) {
        const message = interaction.options.getString('message');
            await interaction.reply({ content: message, ephemeral: false });
        }
    
}