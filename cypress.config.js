const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'tyngys',
  e2e: {
    baseUrl: 'https://buggy.justtestit.org/',
    screenshotOnRunFailure: true,
    video: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
