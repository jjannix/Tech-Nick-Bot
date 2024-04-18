const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Get information about a user')
        .addUserOption(option => option.setName('user').setDescription('The user to get information about').setRequired(true))
        .addBooleanOption(option => option.setName('hideoutput').setDescription('Hide the output of the command').setRequired(true)),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            const hideOutput = interaction.options.getBoolean('hideoutput');
            const member = await interaction.guild.members.fetch(user.id);

            const UserEmbed = new EmbedBuilder()
                .setColor('#FFF4A0')
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .setTitle('User Information')
                .setDescription(`Information about **${user.username}**, requested by **${interaction.user.username}**.`)
                .addFields(
                    { name: 'ID', value: user.id },
                    { name: 'Bot', value: user.bot ? 'Yes' : 'No' },
                    { name: 'Created At', value: user.createdAt.toLocaleString() },
                    { name: 'Joined At', value: member.joinedAt.toLocaleString() },
                    { name: 'Roles', value: member.roles.cache.map(role => role.toString()).join(', ') },
                    { name: 'Nickname', value: member.nickname || 'None' },
                    { name: 'Highest Role', value: member.roles.highest.toString() },
                    { name: 'Permissions', value: member.permissions.toArray().join(', ') },
                    { name: 'Presence', value: member.user.presence && member.user.presence.status ? member.user.presence.status : 'Unknown' },
                    { name: 'Activity', value: member.user.presence && member.user.presence.activities ? member.user.presence.activities.map(activity => activity.name).join(', ') || 'None' : 'None' },
                    { name: 'Avatar URL', value: user.displayAvatarURL() },
                    { name: 'Nickname', value: member.nickname || 'None' },
                    { name: 'Nitro', value: member.premiumSince ? 'Yes' : 'No' },
                    { name: 'Nitro since', value: member.premiumSince ? member.premiumSince.toLocaleString() : 'None' },
                    { name: 'Badges', value: member.user.flags.toArray().join(', ') || 'None' },
                    { name: 'Muted', value: member.isCommunicationDisabled() ? 'Yes' : 'No' },
                    { name: 'MFA', value: member.mfaEnabled ? 'Yes' : 'No' },
                    { name: 'Verified', value: member.user.verified ? 'Yes' : 'No' },
                )
                .setTimestamp()
                .setFooter({ text: '© @jnk 2023' });

            if (hideOutput) {
                return interaction.reply({ embeds: [UserEmbed], ephemeral: true });
            } else {
                return interaction.reply({ embeds: [UserEmbed] });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
        }
    }
};