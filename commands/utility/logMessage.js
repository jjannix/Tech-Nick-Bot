const { SlashCommandBuilder } = require('discord.js');
const { logChannel } = require('../../configuration/config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log')
        .setDescription('Logs a message to a admin channel')
        .addStringOption(option => option.setName('message').setDescription('The message to log').setRequired(true)),
    async execute(interaction) {
        const message = interaction.options.getString('message');


        const channel = interaction.guild.channels.cache.get(logChannel);

        if (channel) {
            channel.send(message);
            await interaction.reply({content: 'Messsage logged!', ephemeral: true});
        } else {
            await interaction.reply('Error: Could not find the specified channel.');
        }
    },
};
