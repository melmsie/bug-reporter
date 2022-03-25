const prisma = require('./../utils/prisma');
const commands = require('../commands');
const logger = require('pino')();
exports.handle = async function (interaction, client) {
  if (!interaction.user) return; // Why wouldn't an interaction have a user object?
  await prisma.user.upsert({
    create: { id: interaction.user.id },
    where: { id: interaction.user.id },
    update: {}
  });

  if (interaction.isCommand()) { // TYPE: Command
    const { commandName } = interaction;
    if (!commands.includes(commandName)) {
      return interaction.reply('This is not a command');
    }

    try {
      await runCommand(commandName, interaction, this);
    } catch (error) {
      interaction.reply(`There was an error: ${error}`);
      logger.error(error.stack, `User: ${interaction.user.username} (${interaction.user.id}) on ${commandName}`);
    }
  } else if (interaction.isButton()) { // TYPE: Buttons
    require('./../handlers/button/index').handle(interaction, this);
  } else if (interaction.isAutocomplete()) { // TYPE: Autocomplete
    require('./../handlers/autocomplete/index').handle(interaction, this);
  } else { // Other types of interactions like forms and shit

  }
};

async function runCommand (command, interaction, client) {
  require(`./../commands/${command}`).run(interaction, client);
}
