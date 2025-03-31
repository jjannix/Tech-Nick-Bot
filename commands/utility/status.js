const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');
const ping = require('ping');
const embedFooter = require('../functions/embedFooter');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Checks the Bot status'),

    async execute(interaction) {
        await interaction.deferReply();

        const systemsStatus = await checkStatus(interaction);
        const { overallStatus, envStatus, pingStatus, cloudflareStatus, errors } = systemsStatus;
        const embedColor = determineStatusColor(overallStatus);

        const statusEmbed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle('Bot Status')
            .addFields(
                { name: 'Overall Status', value: overallStatus },
                { name: 'API Status', value: pingStatus },
                { name: 'Cloudflare Status', value: cloudflareStatus.value, inline: cloudflareStatus.inline },
                { name: 'Environment Variables', value: envStatus },
                { name: 'Errors', value: errors || 'No current errors' }
            )
            .setTimestamp()
            .setFooter({ text: embedFooter() });

        interaction.editReply({ embeds: [statusEmbed] });
    },
};

async function checkStatus(interaction) {
    dotenv.config();

    const excludedVariables = ['axm_actions', 'filter_env', 'node_args'];

    const envVariables = Object.keys(process.env);
    const missingEnvVariables = envVariables.filter(variable => {
        // Exclude the specified variables from the check
        if (excludedVariables.includes(variable)) {
            return false;
        }
        return !process.env[variable];
    });

    let envStatus = '';
    if (missingEnvVariables.length > 0) {
        envStatus = `:x: Error! Missing values for environment variables: ${missingEnvVariables.join(', ')}\n`;
    } else {
        envStatus = 'All environment variables have values assigned.\n';
    }

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
    const botPing = reply.createdTimestamp - interaction.createdTimestamp;
    const pingStatus = `Bot Latency: ${botPing}ms`;

    let overallStatus = 'All systems operational!';
    const latencyThreshold = parseInt(process.env.latencyThreshold) || 500;

    let errors = '';

    if (missingEnvVariables.length > 0 && (botPing > latencyThreshold || cloudflareStatus.value.includes('Error'))) {
        overallStatus = 'Multiple systems are currently experiencing issues!\nFunctionality may be limited!';
        errors = 'Unassigned environment variables, High latency or Cloudflare issue detected';
    } else if (missingEnvVariables.length > 0) {
        overallStatus = 'Some systems are experiencing issues due to unassigned environment variables!';
        errors = 'Unassigned environment variables';
    } else if (botPing > latencyThreshold || cloudflareStatus.value.includes('Error')) {
        overallStatus = 'Warning: High latency or Cloudflare issue detected!';
        errors = 'High latency or Cloudflare issue detected';
    }

    return { overallStatus, envStatus, pingStatus, cloudflareStatus, errors };
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
