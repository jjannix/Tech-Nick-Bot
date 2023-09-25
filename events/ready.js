const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		client.user.setPresence({ activities: [{ name: 'Work in progress. \n https://github.com/jjannix/Tech-Nick-Bot', type: ActivityType.Custom }], status: 'idle' });
        console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
