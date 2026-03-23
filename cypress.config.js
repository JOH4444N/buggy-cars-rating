const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'tyngys',

  retries: {
    runMode: 1,   
    openMode: 1   
  },

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
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
