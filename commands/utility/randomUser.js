const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const embedFooter = require('../functions/embedFooter');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Randomly pick a user')
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel')
                .setDescription('Pick a random user from the current channel'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('role')
                .setDescription('Pick a random user with a specific role')
                .addRoleOption(option => option.setName('role').setDescription('The role to pick from').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Pick a random user from the entire server')),

    async execute(interaction) {
        await interaction.deferReply();

        const subcommand = interaction.options.getSubcommand();
        let users = [];
        let sourceText = '';

        try {
            if (subcommand === 'channel') {
                const channel = interaction.channel;
                const members = await interaction.guild.members.fetch();
                users = members.filter(member => 
                    channel.permissionsFor(member).has(PermissionFlagsBits.ViewChannel) && !member.user.bot
                );
                sourceText = `from channel #${channel.name}`;
            }
            else if (subcommand === 'role') {
                const role = interaction.options.getRole('role');
                const members = await interaction.guild.members.fetch();
                users = members.filter(member => 
                    member.roles.cache.has(role.id) && !member.user.bot
                );
                sourceText = `with role ${role.name}`;
            }
            else if (subcommand === 'server') {
                const members = await interaction.guild.members.fetch();
                users = members.filter(member => !member.user.bot);
                sourceText = `from the entire server`;
            }

            if (users.size === 0) {
                return interaction.editReply('No eligible users found!');
            }

            const randomIndex = Math.floor(Math.random() * users.size);
            const randomUser = users.at(randomIndex);

            const randomEmbed = new EmbedBuilder()
                .setColor('#FF9900')
                .setTitle('🎲 Random User Picker')
                .setDescription(`Randomly selected ${sourceText}`)
                .addFields(
                    { name: 'Selected User', value: `<@${randomUser.id}> (${randomUser.user.tag})` }
                )
                .setThumbnail(randomUser.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({ text: embedFooter() });

            await interaction.editReply({ embeds: [randomEmbed] });
        } catch (error) {
            console.error('Error in random user command:', error);
            await interaction.editReply('An error occurred while picking a random user.');
        }
    },
}; 