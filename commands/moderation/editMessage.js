const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('editmessage')
        .setDescription('Edits the message provided by the message ID')
        .addStringOption(option => option.setName('messageid').setDescription('The ID of the message to edit').setRequired(true))
        .addStringOption(option => option.setName('newmessage').setDescription('The new message to replace the old message with').setRequired(true)),
    async execute(interaction) {
        const messageID = interaction.options.getString('messageid');
        const message = await interaction.channel.messages.fetch(messageID);
        const newmessage = interaction.options.getString('newmessage');
        const channel = await interaction.guild.channels.cache.get(process.env.logChannelId);

        if (message) {
            const oldContent = message.content || "No content";
            message.edit(newmessage);
            interaction.reply({ content: 'Message edited!', ephemeral: true });

            const editLog = new EmbedBuilder()
                .setColor('#E7DC7C')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                .setTitle('Message edited')
                .setDescription(`User **${interaction.user.username}** has edited a message in <#${interaction.channelId}>!`)
                .addFields(
                    { name: 'Message ID', value: messageID },
                    { name: 'Old content', value: oldContent },
                    { name: 'New content', value: newmessage },
                    { name: 'Interaction ID', value: interaction.id },
                )
                .setTimestamp()
                .setFooter({ text: '© @jnk 2023' });

            channel.send({ embeds: [editLog] });
        } else {
            interaction.reply({ content: 'Message not found!', ephemeral: true });
        }
    }
}