const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giverole')
        .setDescription('Give a role to a user')
        .addRoleOption(option => option.setName('role').setDescription('The role to give').setRequired(true))
        .addUserOption(option => option.setName('user').setDescription('The user to give the role to').setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getMember('user');
        const role = interaction.options.getRole('role');

        if (!user.roles.cache.has(role.id)) {
            await user.roles.add(role);

            interaction.reply({ content: `Gave ${user} the role ${role}!`, ephemeral: true });

        } else {
            interaction.reply({ content: `The user ${user} already has the role ${role}!`, ephemeral: true });
        }
    }
}