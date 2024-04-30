const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warns a user')
        .addUserOption(option => option.setName('user').setDescription('The user to warn').setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the warning')
                .setRequired(true)
                .addChoices(
                    { name: 'No Reason', value: 'No Reason' },
                    { name: 'Spamming', value: 'Spamming' },
                    { name: 'Insulting', value: 'Insulting' },
                    { name: 'Griefing', value: 'Griefing' },
                    { name: 'Other', value: 'Other' },
                ))
        .addStringOption(option => option.setName('specification').setDescription('More details about the warning').setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const channel = await interaction.guild.channels.fetch(process.env.logChannelId);
        const bot = interaction.client.user; // Fetch the bot user
        
        const logEmbed = new EmbedBuilder()
            .setColor('#E7823A')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setTitle('User Warned')
            .setDescription(`Warned ${user.tag} for ${reason}`)
            .addFields(
                { name: 'Warned by', value: interaction.user.tag },
                { name: 'Reason', value: reason },
                { name: 'Specification', value: interaction.options.getString('specification') || 'No Specification' },
                { name: 'Interaction ID', value: interaction.id },
            )
            .setTimestamp()
            .setFooter({ text: '© @jnk 2023' });

        const warnEmbed = new EmbedBuilder()
            .setColor('#E7823A')
            .setAuthor({ name: bot.tag, iconURL: bot.displayAvatarURL() })
            .setTitle('You have been warned')
            .setDescription(`You have been warned for ${reason}`)
            .addFields(
                { name: 'Reason', value: reason },
                { name: 'Specification', value: interaction.options.getString('specification') || 'No Specification' },
            )
            .setTimestamp()
            .setFooter({ text: '© @jnk 2023' });

        await user.send({ embeds: [warnEmbed] });
        await interaction.reply({ content: 'User warned!', ephemeral: true });
        channel.send({ embeds: [logEmbed] });
    }

}