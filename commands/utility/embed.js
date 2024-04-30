const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Creates an embed')
        .addStringOption(option => option.setName('title').setDescription('The title of the embed').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('The description of the embed').setRequired(true))
        .addStringOption(option => option.setName('color').setDescription('The color of the embed in hexadecimal format (e.g., #00ff00)').setRequired(false))
        .addStringOption(option => option.setName('thumbnail').setDescription('URL of the thumbnail to be displayed in the embed').setRequired(false)),
    async execute(interaction) {
  
        const customEmbed = new EmbedBuilder()
            .setTitle(interaction.options.getString('title'))
            .setDescription(interaction.options.getString('description'))
            .setColor(interaction.options.getString('color') || 0xffffff)
            .setThumbnail(interaction.options.getString('thumbnail') || process.env.thumbnailImage)

            await interaction.reply({ embeds: [customEmbed] });
            console.log(`Embed created for interaction with ID ${interaction.id}`);
    },
};
