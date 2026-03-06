const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'tyngys',
  
  e2e: {
    baseUrl: 'https://buggy.justtestit.org/',
    screenshotOnRunFailure: true,
    video: false,
    reporter: "mochawesome",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
