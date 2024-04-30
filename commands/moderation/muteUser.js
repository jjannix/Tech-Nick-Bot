const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute a user')
        .addUserOption(option => option.setName('user').setDescription('The user to mute').setRequired(true))
        .addBooleanOption(option => option.setName('confirm').setDescription('Please confirm').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for muting the user')),

    async execute(interaction) {
        try {
            const user = interaction.options.getMember('user');
            const confirm = interaction.options.getBoolean('confirm');
            const reason = interaction.options.getString('reason') ?? 'No reason provided';
            const channel = interaction.guild.channels.cache.get(process.env.logChannelId);

            const logEmbed = new EmbedBuilder()
                .setColor('#BD3E3C')
                .setAuthor({ name: interaction.user?.tag, iconURL: interaction.user?.displayAvatarURL() })
                .setTitle('User Muted')
                .setDescription(`User **${user.user.username}** has been muted by **${interaction.user?.username || 'Unknown User'}** :mute:.`)
                .addFields(
                    { name: 'Reason', value: reason },
                    { name: 'Muted at', value: new Date().toLocaleString() },
                    { name: 'Interaction ID', value: interaction.id },
                )
                .setTimestamp()
                .setFooter({ text: '© @jnk 2023' });

            if (user.id !== interaction.user.id) {
                if (confirm) {
                    const role = interaction.guild.roles.cache.get(process.env.mutedRoleId);

                    if (!role) {
                        return interaction.reply({ content: 'Muted role not found. Please check your configuration.', ephemeral: true });
                    }

                    if (user.roles.cache.has(role.id)) {
                        return interaction.reply({ content: 'User is already muted.', ephemeral: true });
                    }

                    try {
                        await user.roles.add(role);
                        await channel.send({ embeds: [logEmbed] });
                        await user.send(`You have been muted for the following reason: ${reason ?? 'No reason provided'}`);
                        return interaction.reply({ content: 'User has been muted.', ephemeral: true });
                    } catch (error) {
                        console.error(error);
                        await channel.send({ content: `Error: ${error}` })
                        return interaction.reply({ content: 'An error occured during the process.', ephemeral: true });
                    }
                }
            } else {
                return interaction.reply({ content: 'You cannot mute yourself!', ephemeral: true });
            }

        } catch (error) {
            console.log(error);
        }
    }
}