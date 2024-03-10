const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shadowping')
        .setDescription('Creates a shadowping for the selected role')
        .addRoleOption(option => option.setName('role').setDescription('The role to ping').setRequired(true)),

    async execute(interaction) {
        const role = interaction.options.getRole('role');
        interaction.reply({ content: `${role}` });
        interaction.deleteReply();
}
}