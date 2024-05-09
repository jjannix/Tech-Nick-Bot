const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeouts the selected user.')
        .addUserOption(option => option.setName('target').setDescription('The user to timeout').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('The duration of the timeout').setRequired(false)),
        
    
    async execute(interaction) {
        const user = interaction.options.getUser('target');
        const duration = interaction.options.getString('duration');
        const guild = interaction.guild;
        const channel = await interaction.guild.channels.cache.get(process.env.logChannelId);  

        const timeoutLog = new EmbedBuilder()
            .setColor('#BD3E3C')
            .setAuthor({ name: interaction.user?.tag, iconURL: interaction.user?.displayAvatarURL() })
            .setTitle('User timeouted')
            .setDescription(`User **${user.username}** has been timeouted by **${interaction.user?.username || 'Unknown User'}**!`)
            .addFields(
                { name: 'Duration', value: duration + "ms" || '1 minute (default)' },
                { name: 'Timeouted at', value: new Date().toLocaleString() },
                { name: 'Interaction ID', value: interaction.id },
            )
            .setTimestamp()
            .setFooter({ text: '© @jnk 2023' });

        // Timeout the user
        const member = guild.members.cache.get(user.id);
        let timeoutDuration = duration ? parseInt(duration) : 60000; 
        member.timeout(timeoutDuration).then(() => {
            interaction.reply({ content: `User **${user.username}** has been timeouted for ${duration}ms!`, ephemeral: true });
            channel.send({ embeds: [timeoutLog] });
        }).catch(err => {

            console.error('Failed to timeout user:', err);

        });
    },
};
