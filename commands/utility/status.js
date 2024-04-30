const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Checks the Bot status'),

    async execute(interaction) {
        await interaction.deferReply();

        const systemsStatus = await checkStatus(interaction);
        const { overallStatus, envStatus, pingStatus, errors } = systemsStatus;
        const embedColor = determineStatusColor(overallStatus);

        const statusEmbed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle('Bot Status')
            .addFields(
                { name: 'Overall Status', value: overallStatus },
                { name: 'API Status', value: pingStatus },
                { name: 'Environment Variables', value: envStatus },
                { name: 'Errors', value: errors || 'No current errors' }
            )
			.setTimestamp()
			.setFooter({ text: '© @jnk 2023' });

        interaction.editReply({ content: overallStatus, embeds: [statusEmbed] });
    },
};

async function checkStatus(interaction) {
    dotenv.config();

    const envVariables = Object.keys(process.env);
    const missingEnvVariables = envVariables.filter(variable => !process.env[variable]);

    let envStatus = '';
    if (missingEnvVariables.length > 0) {
        envStatus = `:x: Error! Missing values for environment variables: ${missingEnvVariables.join(', ')}\n`;
    } else {
        envStatus = 'All environment variables have values assigned.\n';
    }

    const reply = await interaction.fetchReply();
    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    const pingStatus = `Latency: ${ping}ms`;

    let overallStatus = 'All systems operational!';
    const latencyThreshold = 500;

    let errors = '';

    if (missingEnvVariables.length > 0 && ping > latencyThreshold) {
        overallStatus = 'Multiple systems are currently experiencing issues!\nFunctionality may be limited!';
        errors = 'Unassigned environment variables, High latency detected';
    } else if (missingEnvVariables.length > 0) {
        overallStatus = 'Some systems are experiencing issues due to unassigned environment variables!';
        errors = 'Unassigned environment variables';
    } else if (ping > latencyThreshold) {
        overallStatus = 'Warning: High latency detected!';
        errors = 'High latency detected';
    }

    return { overallStatus, envStatus, pingStatus, errors };
}

function determineStatusColor(overallStatus) {
    if (overallStatus.includes('issues')) {
        return '#FF0000'; // Red for error
    } else if (overallStatus.includes('Warning')) {
        return '#FFA500'; // Orange for warning
    } else {
        return '#00FF00'; // Green for success
    }
}
