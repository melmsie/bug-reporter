const platforms = {
  'Android':              'android',
  'Android (Alpha)':      'androidalpha',
  'iOS':                  'ios',
  'iOS (Testflight)':     'testflight',
  'Desktop':              'desktop',
  'Desktop (Canary)':     'canary',
  'Desktop (PTB)':        'ptb',
  'Web Client (Browser)': 'web'

};
module.exports = {
  async handle (interaction, client) {
    const focusedValue = interaction.options.getFocused();

    const choices = Object.keys(platforms);

    const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase())).slice(0, 10);

    await interaction.respond(
      filtered.map(choice => ({ name: choice, value: platforms[choice] }))
    );
  }
};