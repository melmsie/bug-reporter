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
              description: `The file \`${image.attachment.name}\` is not a valid image file.\n\nYour image wasn't submitted, you can give it to a mod to attach to the bug report if needed.`
            }
          ],
          ephemeral: true
        });
        image = null;
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
          .setFooter({ text: `Posted by ${interaction.user.username} (${interaction.user.id})` })
      ],
      components: [
      {
        type: 1,
        components: [

          {
            type: 2,
            label: 'Notion\'d',
            style: 1,
            custom_id: `admin-fixed-${postData.id}`
          },
          {
            type: 2,
            label: 'Remove',
            style: 4,
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
          description: "Your bug report has been sent!\n\nYou most likely won't hear back about the status of your report, but we'll reach out if we need more information from you!"
        }
      ],
      ephemeral: true
    });
  }
};
