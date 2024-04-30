const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv')

dotenv.config()
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription('Changes the nichname of the selected user')
    .addUserOption(option => option.setName('target').setDescription('The user to rename').setRequired(true))
    .addStringOption(option => option.setName('nickname').setDescription('The new nickname of the user').setRequired(true)),
    async execute(interaction) {
        const guild = interaction.guild;
        const user = interaction.options.getUser('target');
        const nickname = interaction.options.getString('nickname');
        const channel = await interaction.guild.channels.cache.get(process.env.logChannelId);

        const member = await guild.members.fetch(user.id);
    

        await member.setNickname(nickname);

        interaction.reply({content: `Changed the members nickname to ${nickname}!`, ephemeral: true});

        const nicknameLog = new EmbedBuilder()
                .setColor('#B9FF97')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                .setTitle('Nickname changed')
                .setDescription(`**${user.username}**'s nickname changed to **${nickname}** by **${interaction.user.username}**.`)
                .addFields(
                    { name: 'Changed at', value: new Date().toLocaleString() },
                    { name: 'Interaction ID', value: interaction.id },
                )
                .setTimestamp()
                .setFooter({ text: '© @jnk 2023' });

                await channel.send({ embeds: [nicknameLog] });


        

    }
}