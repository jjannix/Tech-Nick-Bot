const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv')
const { isHighLatency } = require('../functions/highLatency');

dotenv.config()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verify a user')
        .addUserOption(option => option.setName('user').setDescription('User to verify').setRequired(true))
        .addBooleanOption(option => option.setName('confirm').setDescription('Confirm the verification').setRequired(true)),

    async execute(interaction) {
        try {
            const reply = await interaction.reply({ content: "Attempting to verify...", fetchReply: true });
            const ping = reply.createdTimestamp - interaction.createdTimestamp;
            const channelCache = interaction.client.channels.cache;
            if (await isHighLatency(ping, interaction, channelCache)) {
            console.log(`High latency detected for ping command: ${ping}ms`);
             }
            const user = interaction.options.getMember('user');
            const confirm = interaction.options.getBoolean('confirm');
            const channel = interaction.guild.channels.cache.get(process.env.logChannelId);

            const verificationEmbed = new EmbedBuilder()
                .setColor('#B9FF97')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                .setTitle('User Verified')
                .setDescription(`User **${user.user.username}** has been verified by **${interaction.user.username}**.`)
                .addFields(
                    { name: 'Verified at', value: new Date().toLocaleString() },
                    { name: 'Interaction ID', value: interaction.id }, 
                )
                .setTimestamp()
                .setFooter({ text: '© @jnk 2023' });
            
                const verificationResult = isEligibleForVerification(user);
                if (!verificationResult.eligible) {

                    const checkFailedEmbed = new EmbedBuilder()
                        .setColor('#BD3E3C')
                        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                        .setTitle('User failed security checks')
                        .setDescription(`User **${user.user.username}** failed the Tech-Nick security checks.`)
                        .addFields(
                            { name: 'User', value: user.user.toString() },
                            { name: 'Reason', value: verificationResult.reason }
                        )
                        .setTimestamp()
                        .setFooter({ text: '© @jnk 2023' });
    
                    await channel.send({ embeds: [checkFailedEmbed] });
                    return interaction.editReply({ content: 'This user is not eligible for verification.', ephemeral: true });
                }

            
            
            if (user.id !== interaction.user.id) {
                if (confirm) {
                    const role = interaction.guild.roles.cache.get(process.env.memberRoleId);

                    if (!role) {
                        return interaction.editReply({ content: 'Role not found. Please check your configuration.', ephemeral: true });
                    }

                    if (user.roles.cache.has(role.id)) {
                        return interaction.editReply({ content: 'User already verified!', ephemeral: true });
                    }

                    try {
                        await user.roles.add(role);
                        await user.send(`Congratulations! You have been verified by ${interaction.user.username}! `);
                        await channel.send({ embeds: [verificationEmbed] });
                        return interaction.editReply({ content: 'User verified!', ephemeral: true });
                    } catch (error) {
                        console.error(error);
                        return interaction.editReply({ content: 'Error adding role to user.', ephemeral: true });
                    }
                } else {
                    return interaction.editReply({ content: 'Verification not confirmed.', ephemeral: true });
                }
            } else {
                return interaction.editReply({ content: 'You cannot verify yourself!', ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            return interaction.editReply({ content: 'An error occurred during verification.', ephemeral: true });
        }
    },
};


function isEligibleForVerification(user) {
    // Check if the user is a bot
    if (user.user.bot) {
        return { eligible: false, reason: 'User is a bot' };
    }
    
    // Check if the user has been on Discord for at least a week
    const accountCreatedDate = user.user.createdAt;
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (accountCreatedDate > oneWeekAgo) {
        return { eligible: false, reason: 'Account is too new' };
    }

    return { eligible: true };
}