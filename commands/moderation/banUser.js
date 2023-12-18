const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv')

dotenv.config()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans the targeted User!')
        .addUserOption(option => option.setName('target').setDescription('The user to ban').setRequired(true))
        .addBooleanOption(option => option.setName('sure').setDescription('Are you sure you want to unban this user?').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the ban').setRequired(false)),
        
    
    async execute(interaction) {
        const user = interaction.options.getUser('target');
        const reasonGiven = interaction.options.getString('reason');
        const guild = interaction.guild;
        const channel = await interaction.guild.channels.cache.get(process.env.logChannelId);
        const reason = reasonGiven || 'No reason given';

        const banEmbed = new EmbedBuilder()
            .setColor('#BD3E3C')
            .setAuthor({ name: interaction.user?.tag, iconURL: interaction.user?.displayAvatarURL() })
            .setTitle('User Banned')
            .setDescription(`User **${user.username}** has been banned by **${interaction.user?.username || 'Unknown User'}** :wave:.`)
            .setTimestamp()
            .setFooter({ text: '© @jnk 2023' });   

        const banLog = new EmbedBuilder()
            .setColor('#BD3E3C')
            .setAuthor({ name: interaction.user?.tag, iconURL: interaction.user?.displayAvatarURL() })
            .setTitle('User Banned')
            .setDescription(`User **${user.username}** has been banned by **${interaction.user?.username || 'Unknown User'}**.`)
            .addFields(
                { name: 'Reason', value: reason },
                { name: 'Banned at', value: new Date().toLocaleString() },
            )
            .setTimestamp()
            .setFooter({ text: '© @jnk 2023' });

        if (interaction.options.getBoolean('sure') === true) {
            guild.members.ban(user, { reason })
            channel.send({ embeds: [banLog] });
            interaction.reply({ embeds: [banEmbed] });
        } else {
            return interaction.reply('Crisis averted! I did not perform this action!');
        }
    },
};
