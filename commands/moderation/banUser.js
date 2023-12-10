const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans the targeted User!')
        .addUserOption(option => option.setName('target').setDescription('The user to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the ban').setRequired(true))
        .addBooleanOption(option => option.setName('sure').setDescription('Are you sure you want to unban this user?').setRequired(true)),
	async execute(interaction) {
        const user = interaction.options.getUser('target');
        const guild = interaction.guild;
        const banEmbed = new EmbedBuilder()
        
        if (interaction.options.getBoolean('sure') === true) {
            guild.members.ban(user);
		    return interaction.reply({content: 'Banned user: ' + user.username + '!', ephemeral: true });
        } else {
            return interaction.reply('Crisis averted! I did not perform this action!');
        }
	},
};