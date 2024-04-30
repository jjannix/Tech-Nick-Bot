// highLatency.js
const dotenv = require('dotenv');
const { EmbedBuilder } = require('discord.js');

dotenv.config();

const LATENCY_THRESHOLD = process.env.latencyThreshold || 500;

async function isHighLatency(ping, interaction, channelCache) {
    if (ping > LATENCY_THRESHOLD) {
        const logEmbed = new EmbedBuilder()
            .setColor('#ABC2C6')
            .setTitle('High Latency Detected')
            .setDescription(`High latency of ${ping}ms detected for interaction with ID ${interaction.id}`)
            .setTimestamp()
            .setFooter({ text: '© @jnk 2023' });

        const channelId = process.env.logChannelId;
        const channel = channelCache.get(channelId);

        if (channel) {
            console.log(`Channel: ${channel.name}, Type: ${channel.type}`);
            if (channel.type !== 'DM') {
                await channel.send({ embeds: [logEmbed] });
            } else {
                console.error(`Channel with ID ${channelId} is a DM channel`);
            }
        } else {
            console.error(`Channel with ID ${channelId} not found`);
        }

        return true;
    } else {
        return false;
    }
}

module.exports = { isHighLatency };
