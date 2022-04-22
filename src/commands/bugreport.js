const config = require('../../config.json');
const prisma = require('../utils/prisma');
const functions = new (require('../utils/functions'))();
const { PostType } = require('@prisma/client');
const { Embed } = require('@discordjs/builders');
module.exports = {
  async run (interaction, client) {
    const description = interaction.options.data[0]?.value;
    const reproduction = interaction.options.data[1]?.value;
    const platform = interaction.options.data[2]?.value;
    const image = interaction.options.data[3];
    if (interaction.options.length < 0) {
      await interaction.reply({
        embeds: [
          {
            description: 'No data'
          }
        ],
        ephemeral: true
      });
      return;
    }

    if (image) {
      const isImage = functions.validateImage(image.attachment.url, image.attachment.contentType);
      if (!isImage) {
        await interaction.reply({
          embeds: [
            {
              description: `The file \`${image.attachment.name}\` is not a valid image file`
            }
          ],
          ephemeral: true
        });
        return;
      }
    }

    const postData = await prisma.post.create({
      data: {
        description: description,
        image: image?.attachment?.url || null,
        messageID: 'n/a',
        steps: reproduction,
        timestamp: new Date(Date.now()),
        type: PostType.BUG,
        userID: interaction.user.id
      }
    });

    const embed = new Embed();

    if (image) {
      embed.setImage(image.attachment.url);
    }

    if (reproduction) {
      embed.addField({ name: 'Steps to Reproduce', value: reproduction });
    }
    if (platform) {
      embed.addField({ name: 'Platform', value: platform });
    }

    const postLink = await interaction.member.guild.channels.resolve(config.bugChannel).send({
      embeds: [
        embed
          .setTitle(`Bug Report #${postData.id}`)
          .setColor(3092790)
          .setDescription(description)
          .setFooter({ text: `Posted by ${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id})` })
      ],
      components: [
      {
        type: 1,
        components: [

          {
            type: 2,
            label: 'Fix',
            style: 2,
            custom_id: `admin-fixed-${postData.id}`
          },
          {
            type: 2,
            label: 'Invalid',
            style: 2,
            custom_id: `admin-removed-${postData.id}`
          }
        ]

      }]
    });

    const updatedEntry = await prisma.post.update({
      where: {
        id: postData.id
      },
      data: {
        messageID: postLink.id
      }
    });

    await interaction.reply({
      embeds: [
        {
          description: `Your bug report is now live [here](https://canary.discord.com/channels/${postLink.guildId}/${postLink.channelId}/${postLink.id})!\n\nWe track these all internally. Even if the post is deleted, we have record of it and will distrubute rewards for *valid* bugs accordingly after the rewrite is live.`
        }
      ],
      ephemeral: true
    });
  }
};
