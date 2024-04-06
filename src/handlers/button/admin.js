const config = require('../../../config.json');
const functions = new (require('../../utils/functions'))();
const prisma = require('../../utils/prisma');
const { Embed } = require('@discordjs/builders');
const admins = [
  '172571295077105664', // Mel
  '284122164582416385', // Aeth
  '214858075650260992', // Bad
  '213912135409991691' // Blue
];
module.exports = {
  async handle (interaction, client) {
    const [type, action, postID] = interaction.customId.split('-');

    const postData = await prisma.post.findFirst({
      where: {
        id: Number(postID)
      },
      include: {
        user: true
      }
    });

    if (!(action === 'removed' && interaction.user.id === postData.user.id) && !admins.includes(interaction.user.id)) {
      return interaction.reply(
        {
          embeds: [
            {
              description: 'You don\'t have permission for this'
            }
          ],
          ephemeral: true
        }
      );
    }

    const oldMessage = await client.channels.cache.get(config.bugChannel).messages.fetch(postData.messageID);

    if (action === 'fixed') {
      await oldMessage.edit({
        embeds: [
          oldMessage.embeds[0]
            .setColor(4902021)
            .setAuthor({
              name: 'FIXED AWAITING DEPLOYMENT',
              iconURL: 'https://cdn.discordapp.com/emojis/575412409737543694.gif?quality=lossless'
            })
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: 'Deployed',
                style: 3,
                custom_id: `admin-deployed-${postData.id}`
              },
              {
                type: 2,
                label: 'Regression',
                style: 4,
                custom_id: `admin-regressed-${postData.id}`
              }
            ]

          }
        ]
      });
      const updatedEntry = await prisma.post.update({
        where: {
          id: postData.id
        },
        data: {
          solved: true
        }
      });
    }

    if (action === 'regressed') {
      await oldMessage.edit({
        embeds: [
          oldMessage.embeds[0]
            .setColor(3092790)
            .setAuthor(null)
        ],
        components: [{
          type: 1,
          components: [
            {
              type: 2,
              label: `Can Reproduce (${postData.votes?.filter(x=>x.reproduced).length || 0})`,
              style: 3,
              custom_id: `vote-positive-${postData.id}`
            },
            {
              type: 2,
              label: `Cannot Reproduce (${postData.votes?.filter(x=>!x.reproduced).length || 0})`,
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
      const updatedEntry = await prisma.post.update({
        where: {
          id: postData.id
        },
        data: {
          solved: false
        }
      });
    }

    if (action === 'removed') {
      const loggedMessage = await interaction.member.guild.channels.resolve(config.logsChannel).send({
        content: `Removed by ${interaction.user.username}`,
        embeds: [
          oldMessage.embeds[0]
        ]
      });
      await oldMessage.delete();
      const updatedEntry = await prisma.post.update({
        where: {
          id: postData.id
        },
        data: {
          removed: true,
          solved: false
        }
      });
    }

    if (action === 'deployed') {
      const loggedMessage = await interaction.member.guild.channels.resolve(config.logsChannel).send({
        content: `Deployed by ${interaction.user.username}`,
        embeds: [
          oldMessage.embeds[0]
            .setColor(4902021)
            .setAuthor({
              name: 'Deployed!',
              iconURL: 'https://cdn.discordapp.com/emojis/575412409737543694.gif?quality=lossless'
            })
        ]
      });
      await oldMessage.delete();
      const updatedEntry = await prisma.post.update({
        where: {
          id: postData.id
        },
        data: {
          removed: true,
          solved: true
        }
      });
    }

    await interaction.deferUpdate();
  }
};
