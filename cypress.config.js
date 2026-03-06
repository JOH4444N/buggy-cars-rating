const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'tyngys',
  
  reporter: "mochawesome",
  reporterOptions: {
      reportDir: "cypress/reports",
      overwrite: false,
      html: false,
      json: true
  },
  
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
