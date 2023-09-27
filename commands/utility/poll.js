const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Creates a poll for people to vote on.')
        .addStringOption(option => option.setName('question').setDescription('The name of the event').setRequired(true)),

    async execute(interaction) {
        const question = interaction.options.getString('question');
        const message = await interaction.reply({ content: question, fetchReply: true });
            await interaction.followUp({ content: 'Poll created', ephemeral: true });
            message.react('✅');
            message.react('❌');
        }
    
}