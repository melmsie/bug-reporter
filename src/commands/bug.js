const config = require('../../config.json');
const prisma = require('../utils/prisma');
const functions = new (require('../utils/functions'))();
const { PostType } = require('@prisma/client');
const { Embed } = require('@discordjs/builders');
// .addStringOption(option => option.setName('description').setDescription('Describe the bug in detail').setRequired(true))
// .addStringOption(option => option.setName('reproduction').setDescription('Describe how we can reproduce it').setRequired(true))
// .addStringOption(option => option.setName('link').setDescription('Message link to the bug happening in this server').setRequired(false))
// .addAttachmentOption(option => option.setName('image').setDescription('A screenshot of your fashion').setRequired(false))
module.exports = {
  async run (interaction, client) {
    const description = interaction.options.data[0]?.value;
    const reproduction = interaction.options.data[1]?.value;
    const link = interaction.options.data[2]?.value;
    const image = interaction.options.data[3];
    if (interaction.options.length < 0) {
      await interaction.reply({
        embeds: [
          {
            description: 'No data? more like no bitches'
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
              description: `The file \`${image.attachment.name}\` is not an image, you're a bit dull aren't you`
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
        link: link || 'No link provided',
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
    if (link) {
      embed.addField({ name: 'Link to Example', value: link });
    }

    const postLink = await interaction.member.guild.channels.resolve(config.bugChannel).send({
      embeds: [
        embed
          .setTitle(`Bug Report #${postData.id}`)
          .setColor(3092790)
          .setDescription(description)
          .setFooter({ text: `Posted by ${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id})` })
      ],
      components: [{
        type: 1,
        components: [
          {
            type: 2,
            label: 'Can Reproduce',
            style: 3,
            custom_id: `vote-positive-${postData.id}`
          },
          {
            type: 2,
            label: 'Cannot Reproduce',
            style: 4,
            custom_id: `vote-negative-${postData.id}`
          }
        ]

      },
      {
        type: 1,
        components: [

          {
            type: 2,
            label: 'Bug Fixed',
            style: 2,
            custom_id: `admin-fixed-${postData.id}`
          },
          {
            type: 2,
            label: 'Remove Post',
            style: 2,
            custom_id: `admin-removed-${postData.id}`
          }
        ]

      }]
    });

    const thread = await postLink.startThread({
      name: `Bug Report #${postData.id}`,
      autoArchiveDuration: 1440,
      invitable: true,
      reason: 'Bug report was filed'
    });

    const updatedEntry = await prisma.post.update({
      where: {
        id: postData.id
      },
      data: {
        messageID: postLink.id,
        threadID: thread.id
      }
    });

    await interaction.reply({
      embeds: [
        {
          description: `Your bug report is now live [here](https://canary.discord.com/channels/${postLink.guildId}/${postLink.channelId}/${postLink.id})!`
        }
      ],
      ephemeral: true
    });
  }
};
