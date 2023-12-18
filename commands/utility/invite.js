const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logChannelId } = require('../../configuration/config.json');
const dotenv = require ('dotenv')

dotenv.config()
module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Creates an invite link')
        .addBooleanOption(option => option.setName('private').setDescription('Does not post the invite link publicly.')),

    async execute(interaction) {
        const private = interaction.options.getBoolean('private');
        const inviteLink = await interaction.channel.createInvite({ maxAge: 0, maxUses: 0, unique: true, targetApplication: null, targetType: null, temporary: private });
        const user = interaction.user;

        if(!private) {
            interaction.reply(`Invite link: ${inviteLink}`);
        } else {
            interaction.reply({ content: 'Invite link sent!', ephemeral: true}) 
            await user.send(`Invite link: ${inviteLink}`);
        }

        const channel = interaction.guild.channels.cache.get(process.env.logChannelId);
        if (channel) {
            const logEmbed = new EmbedBuilder()
                .setColor('#753FFF')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                .setTitle('Invite Link Created')
                .setDescription(`Invite link created by ${interaction.user.tag}.`)
                .addFields(
                    { name: 'Channel', value: `${interaction.channel.name}`, inline: true },
                    { name: 'Private', value: `${private === true ? 'true' : 'false'}`, inline: true },
                )
                
                
                .setTimestamp();

            await channel.send({ embeds: [logEmbed] });
            return
    }
}
}