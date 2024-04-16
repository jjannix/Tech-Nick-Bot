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

        message.edit(newmessage);
        interaction.reply({ content: 'Message edited!', ephemeral: true });

        const editLog = new EmbedBuilder()
            .setColor('#E7DC7C')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() }) // Access user info directly from interaction
            .setTitle('Message edited')
            .setDescription(`User **${interaction.user.username}** has edited a message in <#${interaction.channelId}>!`) // Access user info directly from interaction
            .addFields(
                { name: 'Message ID', value: messageID },
                { name: 'Old content', value: message.content },
                { name: 'New content', value: newmessage },
            )
            .setTimestamp()
            .setFooter({ text: '© @jnk 2023' });

        channel.send({ embeds: [editLog] });

    }
}
