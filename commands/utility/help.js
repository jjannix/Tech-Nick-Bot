const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all available commands.'),

    async execute(interaction) {
        const commandFiles = [];

        function findCommandFiles(dir) {
            const files = fs.readdirSync(dir);

            for (const file of files) {
                const filePath = path.join(dir, file);
                const stats = fs.statSync(filePath);

                if (stats.isDirectory()) {
                    findCommandFiles(filePath);
                } else if (file.endsWith('.js')) {
                    commandFiles.push(filePath);
                }
            }
        }

        findCommandFiles(path.join(__dirname, '..'));

        const commands = [];

        for (const file of commandFiles) {
            const command = require(file);
            if (!command.hidden) {
                commands.push({ name: command.data.name, description: command.data.description });
            }
        }

        const embed = new EmbedBuilder()
            .setColor('#44C265')
            .setTitle('Available Commands')
            .setDescription('Some commands might be hidden or only available to some users.')
            .addFields(
                commands.map(command => ({
                    name: `\`/${command.name}\``,
                    value: `${command.description}`,
                    inline: false,
                }))
            );

        await interaction.reply({ embeds: [embed] });
    },
};
