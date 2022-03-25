const config = require('../../config.json');
const prisma = require('../utils/prisma');
const functions = new (require('../utils/functions'))();
const { PostType } = require('@prisma/client');
const { Embed } = require('@discordjs/builders');
module.exports = {
  async run (interaction, client) {
    const data = interaction.options.data[0];
    const title = interaction.options.data[1]?.value.substr(0, 200);
    const desc = interaction.options.data[2]?.value;
    if (!data) {
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

    const isImage = functions.validateImage(data.attachment.url, data.attachment.contentType);
    if (!isImage) {
      await interaction.reply({
        embeds: [
          {
            description: `The file \`${data.attachment.name}\` is not an image, you're a bit dull aren't you`
          }
        ],
        ephemeral: true
      });
      return;
    }

    const postData = await prisma.post.create({
      data: {
        userID: interaction.user.id,
        type: PostType.FASHION,
        image: data.attachment.url,
        timestamp: new Date(Date.now()),
        description: desc,
        title: title
      }
    });

    const embed = new Embed();

    if (title) {
      embed.setTitle(title);
    }

    if (desc) {
      embed.setDescription(desc);
    }

    const postLink = await interaction.member.guild.channels.resolve(config.fashionChannel).send({
      embeds: [
        embed
          .setImage(data.attachment.url)
          .setFooter({ text: `Post #${postData.id} by ${interaction.user.username}` })
      ],
      components: [{
        type: 1,
        components: [
          {
            type: 2,
            label: 'Drip',
            style: 3,
            custom_id: `vote-positive-${postData.id}`
          },
          {
            type: 2,
            label: 'Drop',
            style: 4,
            custom_id: `vote-negative-${postData.id}`
          },
          {
            type: 2,
            label: 'Results',
            style: 2,
            custom_id: `results-${postData.id}`
          }
        ]

      }]
    });
    await interaction.reply({
      embeds: [
        {
          description: `Your fashion post is now live [here](https://canary.discord.com/channels/${postLink.guildId}/${postLink.channelId}/${postLink.id})!\nUse the \`/post\` command to view results at any time`
        }
      ],
      ephemeral: true
    });
  }
};
