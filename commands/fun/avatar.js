const { isHighLatency } = require('../functions/highLatency');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get the avatar URL of the selected user, or your own avatar.')
        .addUserOption(option => option.setName('target').setDescription('The user\'s avatar to show')),
    async execute(interaction) {
        const reply = await interaction.reply({ content: "Getting avatar...", fetchReply: true });
        const ping = reply.createdTimestamp - interaction.createdTimestamp;
        const channelCache = interaction.client.channels.cache;
        if (await isHighLatency(ping, interaction, channelCache)) {
            console.log(`High latency detected for ping command: ${ping}ms`);
        }

        const user = interaction.options.getUser('target');
        if (user) return interaction.editReply(`${user.username}'s avatar: ${user.displayAvatarURL()}`);
        return interaction.editReply(`Your avatar: ${interaction.user.displayAvatarURL()}`);
    },
};