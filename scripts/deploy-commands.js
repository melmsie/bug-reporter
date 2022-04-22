const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../config.json');

const commands = [
 new SlashCommandBuilder().setName('bugreport').setDescription('Post a bug in the bugs channel')
    .addStringOption(option => option.setName('description').setDescription('Describe the bug in detail.').setRequired(true))
    .addStringOption(option => option.setName('reproduction').setDescription('Describe how we can reproduce this bug.').setRequired(true))
    .addStringOption(option => option.setName('platform').setDescription('What platform did you experience the bug on?').setAutocomplete(true).setRequired(true))
    .addAttachmentOption(option => option.setName('image').setDescription('Attatch a screenshot of the bug').setRequired(false))
]
  .map(command => command.toJSON());


const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log(`Successfully registered ${commands.length} application commands.`))
  .catch(console.error);
