const { SlashCommandBuilder } = require('discord.js');

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
        message.edit(newmessage);
        interaction.reply({content: 'Message edited!', ephemeral: true});

	
    }
}