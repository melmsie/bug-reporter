const handlers = require('fs').readdirSync(__dirname)
  .filter(l => l !== 'index.js')
  .map(l => l.split('.')[0]);

module.exports = {
  async handle (interaction, client) {
    const type = interaction.customId.split('-')[0];
    if (handlers.includes(type)) {
      require(`./${type}.js`).handle(interaction, client);
    }
  }
};
