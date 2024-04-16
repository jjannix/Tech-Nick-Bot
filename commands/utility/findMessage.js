const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv')

dotenv.config()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('findmessage')
        .setDescription('Finds a message based on its ID')
        .addStringOption(option => option.setName('messageid').setDescription('The ID of the message to find').setRequired(false)),

        async execute(interaction) {
            const messageID = interaction.options.getString('messageid');
            const message = await interaction.channel.messages.fetch(messageID);
            interaction.reply({ content: `Message found: ${message.content}`, ephemeral: true });
        }
}