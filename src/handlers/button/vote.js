const prisma = require('./../../utils/prisma');
const config = require('../../../config.json');
module.exports = {
  async handle (interaction, client) {
    const [type, outcome, postID] = interaction.customId.split('-');

    const voteData = await prisma.vote.findFirst({
      where: {
        userID: interaction.user.id,
        postID: Number(postID)
      }
    });

    let postData = await prisma.post.findFirst({
      where: {
        id: Number(postID)
      },
      include: {
        votes: true
      }
    });

    if (postData.userID === interaction.user.id) {
      interaction.reply({
        embeds: [
          { description: 'You cannot "reproduce" with yourself' }
        ],
        ephemeral: true
      });
      return;
    }

    const approve = outcome === 'positive';

    const afterVote = await prisma.vote.upsert({
      create: {
        reproduced: approve,
        userID: interaction.user.id,
        postID: Number(postID),
        timestamp: new Date(Date.now())
      },
      where: {
        userID_postID: {
          userID: interaction.user.id,
          postID: postData.id
        }
      },
      update: {
        reproduced: approve,
        timestamp: new Date(Date.now())
      }
    });

    postData = await prisma.post.findFirst({
      where: {
        id: Number(postID)
      },
      include: {
        votes: true
      }
    });
    
    const oldMessage = await client.channels.cache.get(config.bugChannel).messages.fetch(postData.messageID);
    await oldMessage.edit({
      embeds: [
        oldMessage.embeds[0]
          .setColor(4902021)
          .setAuthor({
            name: 'FIXED AWAITING DEPLOYMENT',
            iconURL: 'https://cdn.discordapp.com/emojis/575412409737543694.gif?quality=lossless'
          })
      ],
      components: [{
        type: 1,
        components: [
          {
            type: 2,
            label: `Can Reproduce (${postData.votes.filter(x=>x.reproduced).length})`,
            style: 3,
            custom_id: `vote-positive-${postData.id}`
          },
          {
            type: 2,
            label: `Cannot Reproduce (${postData.votes.filter(x=>!x.reproduced).length})`,
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

    if (voteData) {
      if (approve === (voteData.approve)) { // This doesn't work rn bc hacky code changes from destiny-shit but who cares
        return interaction.reply(
          {
            embeds: [
              { description: 'You already chose this' }
            ],
            ephemeral: true
          }
        );
      } else {
        return interaction.reply(
          {
            embeds: [
              { description: `You changed your reproduction capabilities on Report #${postID} to \`${approve ? 'can' : 'can not'} reproduce\`` }
            ],
            ephemeral: true
          }
        );
      }
    }

    await interaction.reply(
      {
        embeds: [
          { description: `You voted that you \`${approve ? 'can' : 'can not'} reproduce\` Report #${postID} by <@${postData.userID}>` }
        ],
        ephemeral: true
      }
    );
  }
};
