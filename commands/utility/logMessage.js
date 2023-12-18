const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv')

dotenv.config()
module.exports = {
    data: new SlashCommandBuilder()
        .setName('log')
        .setDescription('Logs a message to an admin channel')
        .addStringOption(option => option.setName('message').setDescription('The message to log').setRequired(true)),
        
    async execute(interaction) {
        const message = interaction.options.getString('message');
        const channel = interaction.guild.channels.cache.get(process.env.logChannelId);

        // Check if the message is empty or undefined
        if (!message) {
            return interaction.reply({ content: 'Error: Message is empty or undefined.', ephemeral: true });
        }

        const logEmbed = new EmbedBuilder()
            .setColor('#ABC2C6')
            .setTitle('Manual Log')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(message)
            .setTimestamp()
            .setFooter({ text: '© @jnk 2023' });

        if (channel) {
            // Check if the channel is a TextChannel before sending the message
            
                await channel.send({ embeds: [logEmbed] });
                await interaction.reply({ content: 'Message logged!', ephemeral: true });
        } else {
            await interaction.reply('Error: Could not find the specified channel.');
        }
    },
};
