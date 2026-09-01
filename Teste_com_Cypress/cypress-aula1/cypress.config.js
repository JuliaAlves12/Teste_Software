module.exports = {
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      baseUrl: "http://localhost:3000"
    },
  },
};
