const { SlashCommandBuilder } = require('discord.js');
const { isHighLatency } = require('../functions/highLatency');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        const reply = await interaction.reply({ content: "Pinging...", fetchReply: true });
        const ping = reply.createdTimestamp - interaction.createdTimestamp;
        const channelCache = interaction.client.channels.cache;
        if (await isHighLatency(ping, interaction, channelCache)) {
            console.log(`High latency detected for ping command: ${ping}ms`);
        }
        interaction.editReply(`Pong! Bot Latency: ${ping}ms`);
    },
};
