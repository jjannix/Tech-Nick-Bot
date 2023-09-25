const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unbans the targeted User!')
        .addUserOption(option => option.setName('target').setDescription('The user you want to unban. USE USER ID!!').setRequired(true)),
	async execute(interaction) {
        const user = interaction.options.getUser('target');
        const guild = interaction.guild;
        guild.members.unban(user);
		return interaction.reply('Pong!');
	},
};