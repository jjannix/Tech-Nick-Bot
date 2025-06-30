const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');
const ping = require('ping');
const embedFooter = require('../functions/embedFooter');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Checks the Bot status'),

    async execute(interaction, client) {
        await interaction.deferReply();

        const systemsStatus = await checkStatus(interaction, client);
        const { overallStatus, botLatency, apiLatency, uptime, memoryUsage, cloudflareStatus, errors } = systemsStatus;
        const embedColor = determineStatusColor(overallStatus);

        const statusEmbed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle('Bot Status')
            .addFields(
                { name: 'Overall Status', value: overallStatus },
                { name: 'Bot Latency', value: botLatency, inline: true },
                { name: 'API Latency', value: apiLatency, inline: true },
                { name: 'Uptime', value: uptime, inline: true },
                { name: 'Memory Usage', value: memoryUsage, inline: true },
                { name: 'Cloudflare Status', value: cloudflareStatus.value, inline: cloudflareStatus.inline },
                
                { name: 'Errors', value: errors || 'No current errors' }
            )
            .setTimestamp()
            .setFooter({ text: embedFooter() });

        interaction.editReply({ embeds: [statusEmbed] });
    },
};

async function checkStatus(interaction, client) {
    dotenv.config();

    

    let cloudflareStatus = { value: '', inline: true };
    try {
        const res = await pingCloudflare();
        if (res !== null) {
            cloudflareStatus.value = `Cloudflare Status: Online, Latency: ${res} ms`;
        } else {
            cloudflareStatus.value = 'Cloudflare Status: Offline';
        }
    } catch (error) {
        console.error('Error while checking Cloudflare status:', error.message);
        cloudflareStatus.value = 'Error checking Cloudflare status';
    }

    const reply = await interaction.fetchReply();
    const botLatency = `${reply.createdTimestamp - interaction.createdTimestamp}ms`;
    const apiLatency = `${client.ws.ping}ms`;

    const uptime = formatUptime(client.uptime);

    const memoryUsage = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;

    let overallStatus = 'All systems operational!';
    const latencyThreshold = parseInt(process.env.latencyThreshold) || 500;
    const memoryThreshold = parseInt(process.env.memoryThreshold) || 200; // MB

    let errors = '';

    const isHighLatency = parseInt(botLatency) > latencyThreshold || parseInt(apiLatency) > latencyThreshold;
    const isHighMemory = parseFloat(memoryUsage) > memoryThreshold;
    const isCloudflareIssue = cloudflareStatus.value.includes('Error') || cloudflareStatus.value.includes('Offline');

    if (isHighLatency || isHighMemory || isCloudflareIssue) {
        overallStatus = 'Multiple systems are currently experiencing issues!\nFunctionality may be limited!';
        const errorList = [];
        if (isHighLatency) errorList.push('High latency');
        if (isHighMemory) errorList.push('High memory usage');
        if (isCloudflareIssue) errorList.push('Cloudflare issue');
        errors = errorList.join(', ');
    }

    return { overallStatus, botLatency, apiLatency, uptime, memoryUsage, cloudflareStatus, errors };
}

async function pingCloudflare() {
    try {
        const res = await ping.promise.probe('1.1.1.1');
        if (res.alive) {
            console.log(`Ping to Cloudflare successful. Latency: ${res.time} ms`);
            return res.time;
        } else {
            console.log('Failed to ping Cloudflare.');
            return null;
        }
    } catch (error) {
        console.error('Error while pinging Cloudflare:', error.message);
        throw error;
    }
}

function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
}

function determineStatusColor(overallStatus) {
    console.log('Overall Status:', overallStatus);

    if (overallStatus.includes('issues') || overallStatus.includes('Offline')) {
        console.log('Color: Red');
        return '#FF0000'; // Red for error
    } else if (overallStatus.includes('Warning')) {
        console.log('Color: Orange');
        return '#FFA500'; // Orange for warning
    } else {
        console.log('Color: Green');
        return '#00FF00'; // Green for success
    }
}
