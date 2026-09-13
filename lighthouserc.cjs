module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist/public",
      url: [
        "http://localhost/",
        "http://localhost/progress-microcontroller",
        "http://localhost/progress-microcontroller/ds18b20-3-speed-fan",
      ],
      numberOfRuns: 3,
    },
    upload: {
      target: "filesystem",
      outputDir: "./tmp/lighthouse-ci",
    },
  },
};
