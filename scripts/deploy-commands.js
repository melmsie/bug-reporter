const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../config.json');

const commands = [
  new SlashCommandBuilder().setName('findsimilar').setDescription('Find similar bug reports so you do not annoy Kable')
    .addStringOption(option => option.setName('description').setDescription('Describe your bug in a one liner').setRequired(true)),

  new SlashCommandBuilder().setName('bug').setDescription('Post a bug in the bugs channel')
    .addStringOption(option => option.setName('description').setDescription('Describe the bug in detail').setRequired(true))
    .addStringOption(option => option.setName('reproduction').setDescription('Describe how we can reproduce it').setRequired(true))
    .addStringOption(option => option.setName('link').setDescription('Message link to the bug happening in this server').setRequired(false))
    .addAttachmentOption(option => option.setName('image').setDescription('A screenshot of your fashion').setRequired(false))

  // new SlashCommandBuilder().setName('feedback').setDescription('Post a bug in the bugs channel')
  //   .addStringOption(option => option.setName('description').setDescription('Describe the bug in detail').setRequired(true)),
]
  .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log(`Successfully registered ${commands.length} application commands.`))
  .catch(console.error);
