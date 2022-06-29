const config = require('../../config.json');
const prisma = require('../utils/prisma');
const functions = new (require('../utils/functions'))();
const { PostType } = require('@prisma/client');
const { Embed } = require('@discordjs/builders');
module.exports = {
  async run (interaction, client) {
    const postData = await prisma.post.findMany({
      where: {
        userID: interaction.options.data[0]?.value,
      },
      include: {
        votes: true
      }
    });

    // I know this is bad code if you're reading this, I'm tired and slightly high and will fix it later

    await interaction.reply({
      embeds: [
        {
          description: `**Stats for <@${interaction.options.data[0]?.value}>**\n\n` +
            `**\`Reported:\`** ${postData.length}\n` +
            `**\`Valid & Fixed:\`** ${postData.filter(x=>x.solved === true).length} (${(postData.filter(x=>x.solved === true).length / postData.length).toFixed(0) * 100}%)\n` +
            `**\`Invalid & Removed:\`** ${postData.filter(x=>x.solved !== true && x.removed === true).length} (${(postData.filter(x=>x.solved !== true && x.removed === true).length / postData.length).toFixed(0) * 100}%)\n` +
            `**\`Pending:\`** ${postData.filter(x=>x.removed !== true).length}`
        }
      ],
      ephemeral: true
    });
  }
};
