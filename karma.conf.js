/* eslint-env node */
'use strict';
const { chromium } = require('playwright-chromium')

process.env.CHROME_BIN = chromium.executablePath()

module.exports = function(config) {
  config.set({
    autoWatch: false,
    singleRun: true,
    files: [
      // https://app.segment.com/segment-libraries/sources/snippet/settings/keys
      'https://cdn.segment.com/analytics.js/v1/zCueSsEKipbrRgqbJarlTG8UJsAZWpkm/analytics.js',
      'test/**/*.test.js'
    ],

    browsers: ['ChromeHeadless'],

    frameworks: ['browserify', 'mocha'],

    reporters: ['spec', 'coverage'],

    preprocessors: {
      'test/**/*.js': 'browserify'
    },

    client: {
      mocha: {
        grep: process.env.GREP,
        reporter: 'html',
        timeout: 10000
      }
    },

    plugins: [
      'karma-*'
    ]
  });
};
