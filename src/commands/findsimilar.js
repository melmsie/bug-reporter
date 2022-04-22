const config = require('../../config.json');
const prisma = require('../utils/prisma');
const functions = new (require('../utils/functions'))();
const { PostType } = require('@prisma/client');
const { Embed } = require('@discordjs/builders');
module.exports = {
  async run (interaction, client) {
    const similar = functions.search('ass', ['what an ass', 'badosz is such an ass', 'wow, the sass', 'amazing ass badosz']);
    return console.log(similar)
    await interaction.reply({
      embeds: [
        {
          description: similar[0]
        }
      ],
      ephemeral: true
    });
  }
};
