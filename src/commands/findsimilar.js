const config = require('../../config.json');
const prisma = require('../utils/prisma');
const functions = new (require('../utils/functions'))();
const { PostType } = require('@prisma/client');
const { Embed } = require('@discordjs/builders');
module.exports = {
  async run (interaction, client) {
    await interaction.reply({
      embeds: [
        {
          description: 'This does nothing so far, wait for badosz to send me a function for it'
        }
      ],
      ephemeral: true
    });
  }
};
