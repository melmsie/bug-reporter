const config = require('../../../config.json');
const functions = new (require('../../utils/functions'))();
const prisma = require('../../utils/prisma');
const { Embed } = require('@discordjs/builders');
const admins = [
  '172571295077105664', // Mel
  '284122164582416385', // Aeth
  '214858075650260992', // Bad
  '613065902723694623', // Zomb
  '304649407444287488', // DR. A
  '863986381738475531', // Angel
];

module.exports = {
  async handle (interaction, client) {
    const [type, action, postID] = interaction.customId.split('-');

    if (!admins.includes(interaction.user.id)) {
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

    const postData = await prisma.post.findFirst({
      where: {
        id: Number(postID)
      }
    });

    let oldMessage;
    try {
      oldMessage = await client.channels.cache.get(config.bugChannel).messages.fetch(postData.messageID);
    } catch (error) {}

    if (action === 'test') {
      await oldMessage.edit({
        embeds: [
          oldMessage.embeds[0]
            .setColor(15978339)
            .setAuthor({
              name: `NEEDS TESTED ${interaction.user.username}`,
              iconURL: 'https://cdn.discordapp.com/emojis/955847572059193344.webp?size=96&quality=lossless'
            })
        ]
      });
    }
    if (action === 'info') {
      await oldMessage.edit({
        embeds: [
          oldMessage.embeds[0]
            .setColor(14666938)
            .setAuthor({
              name: `SENT A DM ${interaction.user.username}`,
              iconURL: 'https://cdn.discordapp.com/emojis/958138188235411548.webp?size=96&quality=lossless'
            })
        ]
      });
    }
    if (action === 'devs') {
      await oldMessage.edit({
        embeds: [
          oldMessage.embeds[0]
            .setColor(3302605)
            .setAuthor({
              name: `PASSED TO DEVS ${interaction.user.username}`,
              iconURL: 'https://cdn.discordapp.com/emojis/605899743645794306.webp?size=96&quality=lossless'
            })
        ]
      });
    }
    if (action === 'fixed') {
      await oldMessage.edit({
        embeds: [
          oldMessage.embeds[0]
            .setColor(4902021)
            .setAuthor({
              name: 'Reported on notion!',
              iconURL: 'https://cdn.discordapp.com/emojis/575412409737543694.gif?quality=lossless'
            })
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: 'Fixed (remove)',
                style: 3,
                custom_id: `admin-deployed-${postData.id}`
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
          solved: false
        }
      });
    }

    if (action === 'removed') {
      const loggedMessage = await interaction.member.guild.channels.resolve(config.logsChannel).send({
        content: `Removed by ${interaction.user.username}`,
        embeds: [
          oldMessage.embeds[0]
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: 'Reward',
                style: 3,
                custom_id: `admin-reward-${postData.id}`
              }
            ]

          }
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
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: 'Reward',
                style: 3,
                custom_id: `admin-reward-${postData.id}`
              }
            ]

          }
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

    if (action === 'reward') {
     
      const updatedEntry = await prisma.post.update({
        where: {
          id: postData.id
        },
        data: {
          reward: true
        }
      });

      await interaction.reply({
        embeds: [
          {
            description: `User post marked as reward worthy`
          }
        ],
        ephemeral: true
      });
    }

    await interaction.deferUpdate();
  }
};

// 9|betareport  | /home/beta/betabugs/bug-reporter/src/handlers/button/admin.js:207
// 9|betareport  | };
// 9|betareport  |  ^
// 9|betareport  | SyntaxError: Unexpected token ';'
// 9|betareport  |     at Object.compileFunction (node:vm:352:18)
// 9|betareport  |     at wrapSafe (node:internal/modules/cjs/loader:1032:15)
// 9|betareport  |     at Module._compile (node:internal/modules/cjs/loader:1067:27)
// 9|betareport  |     at Object.Module._extensions..js (node:internal/modules/cjs/loader:1155:10)
// 9|betareport  |     at Module.load (node:internal/modules/cjs/loader:981:32)
// 9|betareport  |     at Function.Module._load (node:internal/modules/cjs/loader:822:12)
// 9|betareport  |     at Module.require (node:internal/modules/cjs/loader:1005:19)
// 9|betareport  |     at Module.Hook._require.Module.require (/usr/lib/node_modules/pm2/node_modules/require-in-the-middle/index.js:80:39)
// 9|betareport  |     at require (node:internal/modules/cjs/helpers:102:18)
// 9|betareport  |     at Object.handle (/home/beta/betabugs/bug-reporter/src/handlers/button/index.js:9:7)
