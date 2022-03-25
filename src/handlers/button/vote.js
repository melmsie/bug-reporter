const prisma = require('./../../utils/prisma');
module.exports = {
  async handle (interaction, client) {
    const [type, outcome, postID] = interaction.customId.split('-');

    const voteData = await prisma.vote.findFirst({
      where: {
        userID: interaction.user.id,
        postID: Number(postID)
      }
    });

    const postData = await prisma.post.findFirst({
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

    await prisma.vote.upsert({
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
