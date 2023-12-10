const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { memberRoleId, logChannel } = require('../../configuration/config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verify a user')
        .addUserOption(option => option.setName('user').setDescription('User to verify').setRequired(true))
        .addBooleanOption(option => option.setName('confirm').setDescription('Confirm the verification').setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getMember('user');
        const confirm = interaction.options.getBoolean('confirm');
        const channel = interaction.guild.channels.cache.get(logChannel);
        if (user.id != interaction.user.id) {

            if (confirm === true) {
                const role = interaction.guild.roles.cache.get(memberRoleId);

                if (user.roles.cache.has(role.id)) {
                    return interaction.reply({ content: 'User already verified!', ephemeral: true });
                }
                try {
                    await user.roles.add(role);
                    await user.send(`Congratulations! You have been verified by ${interaction.user.username}! `);
                    channel.send(`User ${user.user.username} has been verified by ${interaction.user.username} at ${new Date().toLocaleString()}.`);
                    return interaction.reply({ content: 'User verified!', ephemeral: true });
                } catch (error) {
                    console.error(error);
                    return interaction.reply({ content: 'Error adding role to user.', ephemeral: true });
                }
            }
        } else {
            return interaction.reply({ content: 'You cannot verify yourself!', ephemeral: true });
        }
    },
};
