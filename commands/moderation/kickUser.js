const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks the mentioned User')
    .addUserOption(option => option.setName('target').setDescription('The user to kick').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for kicking the user').setRequired(false)),
    async execute(interaction) {
        const guild = interaction.guild;
        const user = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');
        const kickEmbed = new EmbedBuilder()
            .setColor('#FFA411')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(user.displayAvatarURL())
            .setTitle('User kicked')
            .addFields(
                { name: 'User', value: user.username },
                { name: 'Reason', value: reason },
                { name: 'Kicked by', value: interaction.user.username },
                { name: 'Kicked at', value: new Date().toLocaleString() },
                //{ name: 'Kicked in', value: guild.name },
            )
            .setTimestamp()
            .setFooter({ text: '© @jnk 2023' });
        guild.members.kick(user,reason)
        await interaction.deferReply();
        await wait(1000);
        const message = await interaction.editReply({ embeds: [kickEmbed] });
    }
}