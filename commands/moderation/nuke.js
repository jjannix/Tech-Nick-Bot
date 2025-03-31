const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const embedFooter = require('../functions/embedFooter');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Nuke a channel (delete all messages)')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addBooleanOption(option =>
            option.setName('confirm')
                .setDescription('Confirm that you want to nuke the channel')
                .setRequired(true))
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to nuke (defaults to current channel)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for nuking the channel')
                .setRequired(false)),

    async execute(interaction) {
        // Get options
        const targetChannel = interaction.options.getChannel('channel') || interaction.channel;
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const confirmed = interaction.options.getBoolean('confirm');
        
        // Require confirmation
        if (!confirmed) {
            return interaction.reply({ 
                content: 'Action cancelled. You must confirm to nuke a channel.', 
                ephemeral: true 
            });
        }
        
        if (!targetChannel.manageable) {
            return interaction.reply({ 
                content: 'I don\'t have permission to manage that channel.', 
                ephemeral: true 
            });
        }

        await interaction.deferReply({ ephemeral: true });
        
        try {
            // Create a new channel with the same settings
            const newChannel = await targetChannel.clone({
                reason: `Channel nuked by ${interaction.user.tag}: ${reason}`
            });
            
            await targetChannel.delete(`Channel nuked by ${interaction.user.tag}: ${reason}`);
            
            const logEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Channel Nuked')
                .addFields(
                    { name: 'Channel', value: `#${newChannel.name}`, inline: true },
                    { name: 'Nuked by', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp()
                .setFooter({ text: embedFooter() });
                
            // Try to send log to log channel if configured
            const logChannelId = process.env.logChannelId;
            if (logChannelId) {
                const logChannel = interaction.client.channels.cache.get(logChannelId);
                if (logChannel) {
                    await logChannel.send({ embeds: [logEmbed] });
                }
            }
            
            const nukeEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('💥 Channel Nuked 💥')
                .setDescription(`This channel has been nuked by <@${interaction.user.id}>`)
                .addFields(
                    { name: 'Reason', value: reason }
                )
                .setImage('https://media.giphy.com/media/XrNry0PuTMKvArrHca/giphy.gif')
                .setTimestamp()
                .setFooter({ text: embedFooter() });
                
            await newChannel.send({ embeds: [nukeEmbed] });
            

            await interaction.editReply(`Channel successfully nuked! The new channel is <#${newChannel.id}>`);
            
        } catch (error) {
            console.error('Error nuking channel:', error);
            await interaction.editReply('An error occurred while trying to nuke the channel.');
        }
    },
}; 