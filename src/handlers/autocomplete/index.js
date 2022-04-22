const handlers = require('fs').readdirSync(__dirname)
  .filter(l => l !== 'index.js')
  .map(l => l.split('.')[0]);

module.exports = {
  async handle (interaction, client) {
    if (handlers.includes(interaction.commandName)) {
      require(`./${interaction.commandName}.js`).handle(interaction, client);
    }
  }
};