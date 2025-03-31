const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');
const embedFooter = require('../functions/embedFooter');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Displays information about the server'),
    
    async execute(interaction) {
        const { guild } = interaction;
        const reply = await interaction.reply({ content: "Fetching server info...", fetchReply: true });
        
        // Get server information
        const owner = await guild.fetchOwner();
        const createdTime = moment(guild.createdAt).format('MMMM Do YYYY, h:mm:ss a');
        const createdTimeAgo = moment(guild.createdAt).fromNow();
        const totalMembers = guild.memberCount;
        const serverBoosts = guild.premiumSubscriptionCount;
        const verificationLevel = guild.verificationLevel;
        
        // Count bot vs human members
        const botCount = guild.members.cache.filter(member => member.user.bot).size;
        const humanCount = totalMembers - botCount;
        
        // Get channel counts
        const categories = guild.channels.cache.filter(channel => channel.type === 4).size;
        const textChannels = guild.channels.cache.filter(channel => channel.type === 0).size;
        const voiceChannels = guild.channels.cache.filter(channel => channel.type === 2).size;
        
        const roleCount = guild.roles.cache.size - 1; // Subtract @everyone role
        
        const serverEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${guild.name} Server Information`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: 'Owner', value: `${owner.user.tag}`, inline: true },
                { name: 'Server ID', value: guild.id, inline: true },
                { name: 'Server Created', value: `${createdTime}\n(${createdTimeAgo})`, inline: false },
                { name: 'Members', value: `Total: ${totalMembers}\nHumans: ${humanCount}\nBots: ${botCount}`, inline: true },
                { name: 'Channels', value: `Categories: ${categories}\nText: ${textChannels}\nVoice: ${voiceChannels}`, inline: true },
                { name: 'Roles', value: `${roleCount}`, inline: true },
                { name: 'Boost Count', value: `${serverBoosts}`, inline: true },
                { name: 'Verification Level', value: `${verificationLevel}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: embedFooter() });
            
        if (guild.banner) {
            serverEmbed.setImage(guild.bannerURL({ dynamic: true, size: 1024 }));
        }
        
        await interaction.editReply({ content: null, embeds: [serverEmbed] });
    },
}; 